// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PoolFi Ultimate - Advanced Savings Pool Contract
 * @dev Production-ready contract for Reef hackathon
 * @author PoolFi Team
 * @notice Comprehensive savings pool system with advanced features
 * @dev Optimized for gas efficiency, security, and scalability
 */
contract PoolFiUltimate is ReentrancyGuard, Ownable, Pausable {
    
    // ============ STRUCTS ============
    
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
        bool isCancelled;
        uint256 createdAt;
        uint256 completedAt;
        mapping(address => uint256) contributions;
        mapping(address => bool) members;
        mapping(address => bool) hasWithdrawn;
        address[] memberList;
    }
    
    struct PoolStats {
        uint256 totalPools;
        uint256 activePools;
        uint256 completedPools;
        uint256 totalVolume;
        uint256 totalContributions;
    }
    
    // ============ STATE VARIABLES ============
    
    uint256 public poolCount;
    uint256 public totalVolume;
    uint256 public totalContributions;
    
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256[]) public userPools;
    mapping(address => uint256) public userTotalContributions;
    
    PoolStats public stats;
    
    // ============ EVENTS ============
    
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 deadline
    );
    
    event MemberJoined(
        uint256 indexed poolId,
        address indexed member,
        uint256 timestamp
    );
    
    event ContributionMade(
        uint256 indexed poolId,
        address indexed contributor,
        uint256 amount,
        uint256 totalContributed
    );
    
    event PoolCompleted(
        uint256 indexed poolId,
        uint256 totalAmount,
        uint256 completedAt
    );
    
    event PoolCancelled(
        uint256 indexed poolId,
        address indexed canceller,
        uint256 reason
    );
    
    event FundsWithdrawn(
        uint256 indexed poolId,
        address indexed recipient,
        uint256 amount,
        bool isRefund
    );
    
    event EmergencyWithdraw(
        uint256 indexed poolId,
        address indexed recipient,
        uint256 amount
    );
    
    // ============ MODIFIERS ============
    
    modifier poolExists(uint256 _poolId) {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
        _;
    }
    
    modifier poolActive(uint256 _poolId) {
        require(pools[_poolId].isActive, "Pool is not active");
        _;
    }
    
    modifier poolNotCompleted(uint256 _poolId) {
        require(!pools[_poolId].isCompleted, "Pool is already completed");
        _;
    }
    
    modifier onlyPoolMember(uint256 _poolId) {
        require(pools[_poolId].members[msg.sender], "Not a pool member");
        _;
    }
    
    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        stats = PoolStats(0, 0, 0, 0, 0);
    }
    
    // ============ MAIN FUNCTIONS ============
    
    /**
     * @dev Create a new savings pool
     * @param _name Pool name
     * @param _description Pool description
     * @param _targetAmount Target amount in wei
     * @param _contributionAmount Required contribution amount in wei
     * @param _maxMembers Maximum number of members
     * @param _deadline Pool deadline timestamp
     */
    function createPool(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) external whenNotPaused {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_contributionAmount > 0, "Contribution amount must be greater than 0");
        require(_contributionAmount <= _targetAmount, "Contribution amount cannot exceed target");
        require(_maxMembers > 0 && _maxMembers <= 100, "Invalid max members");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_deadline <= block.timestamp + 365 days, "Deadline too far in future");
        
        poolCount++;
        Pool storage newPool = pools[poolCount];
        
        newPool.id = poolCount;
        newPool.creator = msg.sender;
        newPool.name = _name;
        newPool.description = _description;
        newPool.targetAmount = _targetAmount;
        newPool.contributionAmount = _contributionAmount;
        newPool.maxMembers = _maxMembers;
        newPool.deadline = _deadline;
        newPool.isActive = true;
        newPool.createdAt = block.timestamp;
        
        // Add creator as first member
        newPool.members[msg.sender] = true;
        newPool.memberList.push(msg.sender);
        newPool.currentMembers = 1;
        
        userPools[msg.sender].push(poolCount);
        
        // Update stats
        stats.totalPools++;
        stats.activePools++;
        
        emit PoolCreated(
            poolCount,
            msg.sender,
            _name,
            _targetAmount,
            _contributionAmount,
            _maxMembers,
            _deadline
        );
    }
    
    /**
     * @dev Join an existing pool
     * @param _poolId Pool ID to join
     */
    function joinPool(uint256 _poolId) 
        external 
        poolExists(_poolId)
        poolActive(_poolId)
        poolNotCompleted(_poolId)
        whenNotPaused 
    {
        Pool storage pool = pools[_poolId];
        
        require(!pool.members[msg.sender], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        
        pool.members[msg.sender] = true;
        pool.memberList.push(msg.sender);
        pool.currentMembers++;
        
        userPools[msg.sender].push(_poolId);
        
        emit MemberJoined(_poolId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Contribute to a pool
     * @param _poolId Pool ID to contribute to
     */
    function contribute(uint256 _poolId) 
        external 
        payable 
        poolExists(_poolId)
        poolActive(_poolId)
        poolNotCompleted(_poolId)
        onlyPoolMember(_poolId)
        validAmount(msg.value)
        whenNotPaused 
    {
        Pool storage pool = pools[_poolId];
        
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value == pool.contributionAmount, "Incorrect contribution amount");
        require(pool.contributions[msg.sender] == 0, "Already contributed");
        
        pool.contributions[msg.sender] = msg.value;
        pool.currentAmount += msg.value;
        
        userTotalContributions[msg.sender] += msg.value;
        totalContributions += msg.value;
        totalVolume += msg.value;
        
        stats.totalContributions += msg.value;
        stats.totalVolume += msg.value;
        
        emit ContributionMade(_poolId, msg.sender, msg.value, pool.currentAmount);
        
        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            _completePool(_poolId);
        }
    }
    
    /**
     * @dev Withdraw funds from a completed or cancelled pool
     * @param _poolId Pool ID to withdraw from
     */
    function withdraw(uint256 _poolId) 
        external 
        nonReentrant
        poolExists(_poolId)
        onlyPoolMember(_poolId)
        whenNotPaused 
    {
        Pool storage pool = pools[_poolId];
        
        require(!pool.isActive, "Pool is still active");
        require(!pool.hasWithdrawn[msg.sender], "Already withdrawn");
        require(pool.contributions[msg.sender] > 0, "No contributions to withdraw");
        
        uint256 amount = pool.contributions[msg.sender];
        pool.hasWithdrawn[msg.sender] = true;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(_poolId, msg.sender, amount, pool.isCancelled);
    }
    
    /**
     * @dev Cancel a pool (only creator or after deadline)
     * @param _poolId Pool ID to cancel
     */
    function cancelPool(uint256 _poolId) 
        external 
        poolExists(_poolId)
        poolActive(_poolId)
        poolNotCompleted(_poolId)
        whenNotPaused 
    {
        Pool storage pool = pools[_poolId];
        
        require(
            msg.sender == pool.creator || block.timestamp >= pool.deadline,
            "Not authorized to cancel"
        );
        
        pool.isActive = false;
        pool.isCancelled = true;
        
        stats.activePools--;
        
        emit PoolCancelled(_poolId, msg.sender, 
            block.timestamp >= pool.deadline ? 1 : 0
        );
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get pool information
     * @param _poolId Pool ID
     * @return Pool information
     */
    function getPoolInfo(uint256 _poolId) 
        external 
        view 
        poolExists(_poolId)
        returns (
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
            bool isCompleted,
            bool isCancelled,
            uint256 createdAt,
            uint256 completedAt
        ) 
    {
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
            pool.isCompleted,
            pool.isCancelled,
            pool.createdAt,
            pool.completedAt
        );
    }
    
    /**
     * @dev Get pool members
     * @param _poolId Pool ID
     * @return Array of member addresses
     */
    function getPoolMembers(uint256 _poolId) 
        external 
        view 
        poolExists(_poolId)
        returns (address[] memory) 
    {
        return pools[_poolId].memberList;
    }
    
    /**
     * @dev Get user's contribution to a pool
     * @param _poolId Pool ID
     * @param _user User address
     * @return Contribution amount
     */
    function getUserContribution(uint256 _poolId, address _user) 
        external 
        view 
        poolExists(_poolId)
        returns (uint256) 
    {
        return pools[_poolId].contributions[_user];
    }
    
    /**
     * @dev Check if user is a pool member
     * @param _poolId Pool ID
     * @param _user User address
     * @return True if member
     */
    function isPoolMember(uint256 _poolId, address _user) 
        external 
        view 
        poolExists(_poolId)
        returns (bool) 
    {
        return pools[_poolId].members[_user];
    }
    
    /**
     * @dev Get user's pools
     * @param _user User address
     * @return Array of pool IDs
     */
    function getUserPools(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userPools[_user];
    }
    
    /**
     * @dev Get pool statistics
     * @return Pool statistics
     */
    function getPoolStats() external view returns (PoolStats memory) {
        return stats;
    }
    
    /**
     * @dev Get contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Complete a pool when target is reached
     * @param _poolId Pool ID
     */
    function _completePool(uint256 _poolId) internal {
        Pool storage pool = pools[_poolId];
        
        pool.isActive = false;
        pool.isCompleted = true;
        pool.completedAt = block.timestamp;
        
        stats.activePools--;
        stats.completedPools++;
        
        emit PoolCompleted(_poolId, pool.currentAmount, block.timestamp);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     * @param _poolId Pool ID
     * @param _recipient Recipient address
     */
    function emergencyWithdraw(uint256 _poolId, address _recipient) 
        external 
        onlyOwner 
        poolExists(_poolId)
    {
        Pool storage pool = pools[_poolId];
        require(!pool.isActive, "Pool is still active");
        
        uint256 amount = pool.currentAmount;
        pool.currentAmount = 0;
        
        (bool success, ) = payable(_recipient).call{value: amount}("");
        require(success, "Emergency withdrawal failed");
        
        emit EmergencyWithdraw(_poolId, _recipient, amount);
    }
    
    /**
     * @dev Update pool statistics
     */
    function updateStats() external onlyOwner {
        stats.totalPools = poolCount;
        stats.totalVolume = totalVolume;
        stats.totalContributions = totalContributions;
    }
    
    // ============ RECEIVE FUNCTION ============
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Accept ETH for pool contributions
    }
}
