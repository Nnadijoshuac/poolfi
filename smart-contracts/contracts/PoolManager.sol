// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PoolManager
 * @dev Manages collaborative savings pools on Reef Network
 * @author PoolFi Team
 * @notice This contract allows users to create and manage collaborative savings pools
 * @dev Implements comprehensive security measures and gas optimizations
 */
contract PoolManager is ReentrancyGuard, Ownable, Pausable {
    // Pool structure
    struct Pool {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 deadline;
        bool isActive;
        bool isCompleted;
        mapping(address => uint256) contributions;
        mapping(address => bool) members;
        address[] memberList;
    }

    // State variables
    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;
    
    // Additional state variables for enhanced functionality
    mapping(address => uint256[]) public userPools; // Track pools created by user
    mapping(address => uint256[]) public userMemberships; // Track pools user is member of
    uint256 public platformFee; // Platform fee in basis points (100 = 1%)
    address public feeRecipient; // Address to receive platform fees
    uint256 public constant MAX_PLATFORM_FEE = 500; // Maximum 5% platform fee
    uint256 public constant BASIS_POINTS = 10000; // 100% in basis points
    
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 deadline
    );
    
    event MemberJoined(uint256 indexed poolId, address indexed member);
    
    event ContributionMade(
        uint256 indexed poolId,
        address indexed contributor,
        uint256 amount
    );
    
    event PoolCompleted(uint256 indexed poolId, uint256 totalAmount);
    
    event FundsWithdrawn(
        uint256 indexed poolId,
        address indexed member,
        uint256 amount
    );
    
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event PoolPaused(uint256 indexed poolId);
    event PoolUnpaused(uint256 indexed poolId);

    // Modifiers
    modifier validPool(uint256 _poolId) {
        require(_poolId < poolCount, "Pool does not exist");
        require(pools[_poolId].isActive, "Pool is not active");
        _;
    }
    
    modifier onlyPoolMember(uint256 _poolId) {
        require(pools[_poolId].members[msg.sender], "Not a pool member");
        _;
    }
    
    modifier poolNotCompleted(uint256 _poolId) {
        require(!pools[_poolId].isCompleted, "Pool is completed");
        _;
    }

    constructor() Ownable(msg.sender) {
        platformFee = 100; // 1% default platform fee
        feeRecipient = msg.sender;
    }

    /**
     * @dev Create a new savings pool
     * @param _name Pool name
     * @param _description Pool description
     * @param _targetAmount Target amount to reach
     * @param _contributionAmount Amount each member contributes
     * @param _maxMembers Maximum number of members
     * @param _deadline Pool deadline timestamp
     * @return poolId The ID of the created pool
     */
    function createPool(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_contributionAmount > 0, "Contribution amount must be greater than 0");
        require(_maxMembers > 0, "Max members must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        uint256 poolId = poolCount++;
        Pool storage pool = pools[poolId];
        
        pool.id = poolId;
        pool.creator = msg.sender;
        pool.name = _name;
        pool.description = _description;
        pool.targetAmount = _targetAmount;
        pool.contributionAmount = _contributionAmount;
        pool.maxMembers = _maxMembers;
        pool.deadline = _deadline;
        pool.isActive = true;
        
        // Add creator as first member
        pool.members[msg.sender] = true;
        pool.memberList.push(msg.sender);
        pool.currentMembers = 1;
        
        // Track user's created pools and memberships
        userPools[msg.sender].push(poolId);
        userMemberships[msg.sender].push(poolId);

        emit PoolCreated(
            poolId,
            msg.sender,
            _name,
            _targetAmount,
            _contributionAmount,
            _maxMembers,
            _deadline
        );
        
        return poolId;
    }

    /**
     * @dev Join an existing pool
     * @param _poolId Pool ID to join
     */
    function joinPool(uint256 _poolId) external validPool(_poolId) whenNotPaused {
        Pool storage pool = pools[_poolId];
        
        require(!pool.members[msg.sender], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");

        pool.members[msg.sender] = true;
        pool.memberList.push(msg.sender);
        pool.currentMembers++;
        
        // Track user's membership
        userMemberships[msg.sender].push(_poolId);

        emit MemberJoined(_poolId, msg.sender);
    }

    /**
     * @dev Make a contribution to a pool
     * @param _poolId Pool ID to contribute to
     */
    function contribute(uint256 _poolId) 
        external 
        payable 
        validPool(_poolId) 
        onlyPoolMember(_poolId)
        poolNotCompleted(_poolId)
        whenNotPaused
    {
        Pool storage pool = pools[_poolId];
        
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value == pool.contributionAmount, "Incorrect contribution amount");

        pool.contributions[msg.sender] += msg.value;
        pool.currentAmount += msg.value;

        emit ContributionMade(_poolId, msg.sender, msg.value);

        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            pool.isCompleted = true;
            pool.isActive = false;
            emit PoolCompleted(_poolId, pool.currentAmount);
        }
    }

    /**
     * @dev Withdraw funds from a completed pool (for pool members)
     * @param _poolId Pool ID to withdraw from
     */
    function withdrawFunds(uint256 _poolId) 
        external 
        onlyPoolMember(_poolId)
        whenNotPaused
    {
        require(_poolId < poolCount, "Pool does not exist");
        Pool storage pool = pools[_poolId];
        
        require(pool.isCompleted, "Pool is not completed");
        require(pool.contributions[msg.sender] > 0, "No contributions to withdraw");

        uint256 userContribution = pool.contributions[msg.sender];
        pool.contributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: userContribution}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(_poolId, msg.sender, userContribution);
    }

    /**
     * @dev Get pool information
     * @param _poolId Pool ID
     * @return id Pool ID
     * @return creator Pool creator address
     * @return name Pool name
     * @return description Pool description
     * @return targetAmount Target amount
     * @return currentAmount Current amount
     * @return contributionAmount Contribution amount
     * @return maxMembers Maximum members
     * @return currentMembers Current members
     * @return deadline Pool deadline
     * @return isActive Pool active status
     * @return isCompleted Pool completion status
     */
    function getPoolInfo(uint256 _poolId) external view returns (
        uint256 id,
        address creator,
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 currentAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 currentMembers,
        uint256 deadline,
        bool isActive,
        bool isCompleted
    ) {
        Pool storage pool = pools[_poolId];
        return (
            pool.id,
            pool.creator,
            pool.name,
            pool.description,
            pool.targetAmount,
            pool.currentAmount,
            pool.contributionAmount,
            pool.maxMembers,
            pool.currentMembers,
            pool.deadline,
            pool.isActive,
            pool.isCompleted
        );
    }

    /**
     * @dev Get pool members
     * @param _poolId Pool ID
     * @return Array of member addresses
     */
    function getPoolMembers(uint256 _poolId) external view returns (address[] memory) {
        return pools[_poolId].memberList;
    }

    /**
     * @dev Get user's contribution to a pool
     * @param _poolId Pool ID
     * @param _user User address
     * @return Contribution amount
     */
    function getUserContribution(uint256 _poolId, address _user) external view returns (uint256) {
        return pools[_poolId].contributions[_user];
    }

    /**
     * @dev Check if user is a pool member
     * @param _poolId Pool ID
     * @param _user User address
     * @return True if user is a member
     */
    function isPoolMember(uint256 _poolId, address _user) external view returns (bool) {
        return pools[_poolId].members[_user];
    }

    /**
     * @dev Emergency pause function (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause function (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    /**
     * @dev Get pools created by a user
     * @param _user User address
     * @return Array of pool IDs created by user
     */
    function getUserPools(address _user) external view returns (uint256[] memory) {
        return userPools[_user];
    }

    /**
     * @dev Get pools where user is a member
     * @param _user User address
     * @return Array of pool IDs where user is member
     */
    function getUserMemberships(address _user) external view returns (uint256[] memory) {
        return userMemberships[_user];
    }

    /**
     * @dev Get total balance of all pools
     * @return Total ETH balance in contract
     */
    function getTotalBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Check if pool deadline has passed
     * @param _poolId Pool ID
     * @return True if deadline has passed
     */
    function isPoolExpired(uint256 _poolId) external view returns (bool) {
        return block.timestamp >= pools[_poolId].deadline;
    }

    /**
     * @dev Get pool progress percentage
     * @param _poolId Pool ID
     * @return Progress percentage (0-100)
     */
    function getPoolProgress(uint256 _poolId) external view returns (uint256) {
        Pool storage pool = pools[_poolId];
        if (pool.targetAmount == 0) return 0;
        return (pool.currentAmount * 100) / pool.targetAmount;
    }

    /**
     * @dev Set platform fee (only owner)
     * @param _fee New platform fee in basis points
     */
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_PLATFORM_FEE, "Fee too high");
        uint256 oldFee = platformFee;
        platformFee = _fee;
        emit PlatformFeeUpdated(oldFee, _fee);
    }

    /**
     * @dev Set fee recipient (only owner)
     * @param _recipient New fee recipient address
     */
    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = _recipient;
        emit FeeRecipientUpdated(oldRecipient, _recipient);
    }

    /**
     * @dev Pause a specific pool (only owner)
     * @param _poolId Pool ID to pause
     */
    function pausePool(uint256 _poolId) external onlyOwner validPool(_poolId) {
        pools[_poolId].isActive = false;
        emit PoolPaused(_poolId);
    }

    /**
     * @dev Unpause a specific pool (only owner)
     * @param _poolId Pool ID to unpause
     */
    function unpausePool(uint256 _poolId) external onlyOwner {
        require(_poolId < poolCount, "Pool does not exist");
        pools[_poolId].isActive = true;
        emit PoolUnpaused(_poolId);
    }

    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        require(feeRecipient != address(0), "No fee recipient set");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(feeRecipient).call{value: balance}("");
        require(success, "Fee withdrawal failed");
    }

    /**
     * @dev Get platform statistics
     * @return totalPools Total number of pools created
     * @return totalBalance Total ETH balance in contract
     * @return platformFeeRate Current platform fee rate
     */
    function getPlatformStats() external view returns (
        uint256 totalPools,
        uint256 totalBalance,
        uint256 platformFeeRate
    ) {
        return (poolCount, address(this).balance, platformFee);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}