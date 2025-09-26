// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecurePool {
    struct Pool {
        address[] members;
        mapping(address => uint256) contributions;
        uint256 targetAmount;
        uint256 deadline;
        uint256 maxMembers;
        uint256 currentMembers;
        bool isActive;
        bool isCompleted;
    }

    mapping(uint256 => Pool) public pools;
    uint256 public poolCount;

    // Events
    event PoolCreated(uint256 indexed poolId, address creator, uint256 targetAmount, uint256 deadline);
    event Contributed(uint256 indexed poolId, address contributor, uint256 amount);
    event PoolCompleted(uint256 indexed poolId);
    event PoolCanceled(uint256 indexed poolId);
    event Withdrawn(uint256 indexed poolId, address indexed recipient, uint256 amount);

    // Create a new pool
    function createPool(
        uint256 _targetAmount,
        uint256 _deadline,
        uint256 _maxMembers
    ) external {
        require(_targetAmount > 0, "Target amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_maxMembers > 0, "Max members must be > 0");

        poolCount++;
        Pool storage newPool = pools[poolCount];
        newPool.targetAmount = _targetAmount;
        newPool.deadline = _deadline;
        newPool.maxMembers = _maxMembers;
        newPool.isActive = true;

        emit PoolCreated(poolCount, msg.sender, _targetAmount, _deadline);
    }

    // Join a pool (atomic join + contribute to prevent front-running)
    function joinAndContribute(uint256 _poolId) external payable {
        Pool storage pool = pools[_poolId];
        require(pool.isActive, "Pool is not active");
        require(block.timestamp < pool.deadline, "Pool deadline passed");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(msg.value > 0, "Contribution must be > 0");
        require(
            pool.contributions[msg.sender] + msg.value <= pool.targetAmount,
            "Total contributions exceed target"
        );

        // Checks (all requirements passed)
        pool.members.push(msg.sender);
        pool.currentMembers++;
        pool.contributions[msg.sender] += msg.value;

        // Check if pool is completed
        uint256 totalContributed;
        for (uint256 i = 0; i < pool.members.length; i++) {
            totalContributed += pool.contributions[pool.members[i]];
        }

        if (totalContributed >= pool.targetAmount) {
            pool.isActive = false;
            pool.isCompleted = true;
            emit PoolCompleted(_poolId);
        }

        emit Contributed(_poolId, msg.sender, msg.value);
    }

    // Cancel a pool after deadline if target not met
    function cancelPool(uint256 _poolId) external {
        Pool storage pool = pools[_poolId];
        require(!pool.isCompleted, "Pool is already completed");
        require(block.timestamp >= pool.deadline, "Deadline not reached");
        require(pool.isActive, "Pool is not active");

        pool.isActive = false;
        emit PoolCanceled(_poolId);
    }

    // Withdraw contributions (after pool completion or cancellation)
    function withdraw(uint256 _poolId) external {
        Pool storage pool = pools[_poolId];
        require(!pool.isActive, "Pool is still active");
        uint256 amount = pool.contributions[msg.sender];
        require(amount > 0, "No contributions to withdraw");

        pool.contributions[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(_poolId, msg.sender, amount);
    }

    // Fallback/receive function (rejects direct ETH transfers)
    receive() external payable {
        revert("Use joinAndContribute instead");
    }
}
