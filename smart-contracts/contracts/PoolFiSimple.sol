// SPDX-License-Identifier: MIT
// PoolFi Simple - Streamlined Savings Pool Contract
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PoolFi Simple - Streamlined Savings Pool Contract
 * @dev Optimized for Remix compilation and Reef hackathon
 * @author PoolFi Team
 */
contract PoolFiSimple is ReentrancyGuard, Ownable {
    
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
    }
    
    // ============ STATE VARIABLES ============
    
    uint256 public poolCount;
    uint256 public totalVolume;
    
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256[]) public userPools;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => mapping(address => bool)) public members;
    mapping(uint256 => mapping(address => bool)) public hasWithdrawn;
    mapping(uint256 => address[]) public poolMembers;
    
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
        address indexed member
    );
    
    event ContributionMade(
        uint256 indexed poolId,
        address indexed contributor,
        uint256 amount,
        uint256 totalContributed
    );
    
    event PoolCompleted(
        uint256 indexed poolId,
        uint256 totalAmount
    );
    
    event PoolCancelled(
        uint256 indexed poolId,
        address indexed canceller
    );
    
    event FundsWithdrawn(
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
    
    modifier onlyPoolMember(uint256 _poolId) {
        require(members[_poolId][msg.sender], "Not a pool member");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) {}
    
    // ============ MAIN FUNCTIONS ============
    
    /**
     * @dev Create a new savings pool
     */
    function createPool(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) external {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_contributionAmount > 0, "Contribution amount must be greater than 0");
        require(_contributionAmount <= _targetAmount, "Contribution amount cannot exceed target");
        require(_maxMembers > 0 && _maxMembers <= 100, "Invalid max members");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        poolCount++;
        
        pools[poolCount] = Pool({
            id: poolCount,
            creator: msg.sender,
            name: _name,
            description: _description,
            targetAmount: _targetAmount,
            currentAmount: 0,
            contributionAmount: _contributionAmount,
            maxMembers: _maxMembers,
            currentMembers: 1,
            deadline: _deadline,
            isActive: true,
            isCompleted: false,
            isCancelled: false,
            createdAt: block.timestamp
        });
        
        // Add creator as first member
        members[poolCount][msg.sender] = true;
        poolMembers[poolCount].push(msg.sender);
        userPools[msg.sender].push(poolCount);
        
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
     */
    function joinPool(uint256 _poolId) external poolExists(_poolId) poolActive(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(!members[_poolId][msg.sender], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(!pool.isCompleted, "Pool is completed");
        
        members[_poolId][msg.sender] = true;
        poolMembers[_poolId].push(msg.sender);
        pool.currentMembers++;
        
        userPools[msg.sender].push(_poolId);
        
        emit MemberJoined(_poolId, msg.sender);
    }
    
    /**
     * @dev Contribute to a pool
     */
    function contribute(uint256 _poolId) external payable poolExists(_poolId) poolActive(_poolId) onlyPoolMember(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value == pool.contributionAmount, "Incorrect contribution amount");
        require(contributions[_poolId][msg.sender] == 0, "Already contributed");
        require(!pool.isCompleted, "Pool is completed");
        
        contributions[_poolId][msg.sender] = msg.value;
        pool.currentAmount += msg.value;
        
        totalVolume += msg.value;
        
        emit ContributionMade(_poolId, msg.sender, msg.value, pool.currentAmount);
        
        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            pool.isActive = false;
            pool.isCompleted = true;
            emit PoolCompleted(_poolId, pool.currentAmount);
        }
    }
    
    /**
     * @dev Withdraw funds from a completed or cancelled pool
     */
    function withdraw(uint256 _poolId) external nonReentrant poolExists(_poolId) onlyPoolMember(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(!pool.isActive, "Pool is still active");
        require(!hasWithdrawn[_poolId][msg.sender], "Already withdrawn");
        require(contributions[_poolId][msg.sender] > 0, "No contributions to withdraw");
        
        uint256 amount = contributions[_poolId][msg.sender];
        hasWithdrawn[_poolId][msg.sender] = true;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(_poolId, msg.sender, amount);
    }
    
    /**
     * @dev Cancel a pool
     */
    function cancelPool(uint256 _poolId) external poolExists(_poolId) poolActive(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(
            msg.sender == pool.creator || block.timestamp >= pool.deadline,
            "Not authorized to cancel"
        );
        
        pool.isActive = false;
        pool.isCancelled = true;
        
        emit PoolCancelled(_poolId, msg.sender);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get pool basic information
     */
    function getPoolInfo(uint256 _poolId) external view poolExists(_poolId) returns (
        uint256 id,
        address creator,
        string memory name,
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
     */
    function getPoolMembers(uint256 _poolId) external view poolExists(_poolId) returns (address[] memory) {
        return poolMembers[_poolId];
    }
    
    /**
     * @dev Get user's contribution to a pool
     */
    function getUserContribution(uint256 _poolId, address _user) external view poolExists(_poolId) returns (uint256) {
        return contributions[_poolId][_user];
    }
    
    /**
     * @dev Check if user is a pool member
     */
    function isPoolMember(uint256 _poolId, address _user) external view poolExists(_poolId) returns (bool) {
        return members[_poolId][_user];
    }
    
    /**
     * @dev Get user's pools
     */
    function getUserPools(address _user) external view returns (uint256[] memory) {
        return userPools[_user];
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ============ RECEIVE FUNCTION ============
    
    receive() external payable {
        // Accept ETH for pool contributions
    }
}
