// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimplePoolManager
 * @dev Simplified collaborative savings pools for Reef Network
 * @author PoolFi Team
 */
contract SimplePoolManager {
    // Pool structure
    struct Pool {
        uint256 id;
        address creator;
        string name;
        uint256 targetAmount;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 deadline;
        bool isActive;
        mapping(address => uint256) contributions;
        mapping(address => bool) members;
        address[] memberList;
    }

    // State variables
    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;
    
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers
    );
    
    event MemberJoined(uint256 indexed poolId, address indexed member);
    event ContributionMade(uint256 indexed poolId, address indexed contributor, uint256 amount);
    event PoolCompleted(uint256 indexed poolId);

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

    /**
     * @dev Create a new savings pool
     */
    function createPool(
        string memory _name,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_contributionAmount > 0, "Contribution amount must be greater than 0");
        require(_maxMembers > 0, "Max members must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        uint256 poolId = poolCount++;
        Pool storage pool = pools[poolId];
        
        pool.id = poolId;
        pool.creator = msg.sender;
        pool.name = _name;
        pool.targetAmount = _targetAmount;
        pool.contributionAmount = _contributionAmount;
        pool.maxMembers = _maxMembers;
        pool.deadline = _deadline;
        pool.isActive = true;
        
        // Add creator as first member
        pool.members[msg.sender] = true;
        pool.memberList.push(msg.sender);
        pool.currentMembers = 1;

        emit PoolCreated(poolId, msg.sender, _name, _targetAmount, _contributionAmount, _maxMembers);
        return poolId;
    }

    /**
     * @dev Join an existing pool
     */
    function joinPool(uint256 _poolId) external validPool(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(!pool.members[msg.sender], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");

        pool.members[msg.sender] = true;
        pool.memberList.push(msg.sender);
        pool.currentMembers++;

        emit MemberJoined(_poolId, msg.sender);
    }

    /**
     * @dev Make a contribution to a pool
     */
    function contribute(uint256 _poolId) external payable validPool(_poolId) onlyPoolMember(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value == pool.contributionAmount, "Incorrect contribution amount");

        pool.contributions[msg.sender] += msg.value;

        emit ContributionMade(_poolId, msg.sender, msg.value);

        // Check if pool is completed
        if (address(this).balance >= pool.targetAmount) {
            pool.isActive = false;
            emit PoolCompleted(_poolId);
        }
    }

    /**
     * @dev Get basic pool information
     */
    function getPoolInfo(uint256 _poolId) external view returns (
        uint256 id,
        address creator,
        string memory name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 currentMembers,
        uint256 deadline,
        bool isActive
    ) {
        Pool storage pool = pools[_poolId];
        return (
            pool.id,
            pool.creator,
            pool.name,
            pool.targetAmount,
            pool.contributionAmount,
            pool.maxMembers,
            pool.currentMembers,
            pool.deadline,
            pool.isActive
        );
    }

    /**
     * @dev Get pool members
     */
    function getPoolMembers(uint256 _poolId) external view returns (address[] memory) {
        return pools[_poolId].memberList;
    }

    /**
     * @dev Get user's contribution to a pool
     */
    function getUserContribution(uint256 _poolId, address _user) external view returns (uint256) {
        return pools[_poolId].contributions[_user];
    }

    /**
     * @dev Check if user is a pool member
     */
    function isPoolMember(uint256 _poolId, address _user) external view returns (bool) {
        return pools[_poolId].members[_user];
    }

    /**
     * @dev Get total contract balance
     */
    function getTotalBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}