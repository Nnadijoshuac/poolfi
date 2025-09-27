// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PoolFi {
    struct Pool {
        uint256 id;
        address creator;
        string name;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 deadline;
        bool isActive;
        bool isCompleted;
        address[] contributors;
        uint256[] contributions;
    }

    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256[]) public userPools;
    mapping(uint256 => mapping(address => bool)) public hasContributed;
    mapping(uint256 => mapping(address => bool)) public hasWithdrawn;

    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 deadline
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

    modifier poolExists(uint256 _poolId) {
        require(pools[_poolId].id != 0, "Pool does not exist");
        _;
    }

    modifier poolActive(uint256 _poolId) {
        require(pools[_poolId].isActive, "Pool is not active");
        _;
    }

    modifier onlyPoolMember(uint256 _poolId) {
        require(hasContributed[_poolId][msg.sender], "Not a pool contributor");
        _;
    }

    // ============ MAIN FUNCTIONS ============

    /// @notice Create a new savings pool
    /// @param _name Pool name
    /// @param _targetAmount Target amount to raise
    /// @param _contributionAmount Required contribution amount
    /// @param _maxMembers Maximum number of contributors
    /// @param _deadline Pool deadline timestamp
    function createPool(
        string memory _name,
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
            targetAmount: _targetAmount,
            currentAmount: 0,
            contributionAmount: _contributionAmount,
            maxMembers: _maxMembers,
            currentMembers: 0,
            deadline: _deadline,
            isActive: true,
            isCompleted: false,
            contributors: new address[](0),
            contributions: new uint256[](0)
        });

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

    /// @notice Contribute to a pool
    /// @param _poolId Pool ID to contribute to
    function contribute(uint256 _poolId) external payable poolExists(_poolId) poolActive(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value == pool.contributionAmount, "Incorrect contribution amount");
        require(!hasContributed[_poolId][msg.sender], "Already contributed");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        require(!pool.isCompleted, "Pool is completed");

        hasContributed[_poolId][msg.sender] = true;
        pool.contributors.push(msg.sender);
        pool.contributions.push(msg.value);
        pool.currentAmount += msg.value;
        pool.currentMembers++;

        userPools[msg.sender].push(_poolId);

        emit ContributionMade(_poolId, msg.sender, msg.value, pool.currentAmount);

        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            pool.isActive = false;
            pool.isCompleted = true;
            emit PoolCompleted(_poolId, pool.currentAmount);
        }
    }

    /// @notice Withdraw funds from a completed pool
    /// @param _poolId Pool ID to withdraw from
    function withdraw(uint256 _poolId) external poolExists(_poolId) onlyPoolMember(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(!pool.isActive, "Pool is still active");
        require(!hasWithdrawn[_poolId][msg.sender], "Already withdrawn");

        // Find user's contribution
        uint256 userContribution = 0;
        for (uint256 i = 0; i < pool.contributors.length; i++) {
            if (pool.contributors[i] == msg.sender) {
                userContribution = pool.contributions[i];
                break;
            }
        }

        require(userContribution > 0, "No contribution to withdraw");
        hasWithdrawn[_poolId][msg.sender] = true;

        (bool success, ) = payable(msg.sender).call{value: userContribution}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(_poolId, msg.sender, userContribution);
    }

    /// @notice Cancel a pool (only creator or after deadline)
    /// @param _poolId Pool ID to cancel
    function cancelPool(uint256 _poolId) external poolExists(_poolId) poolActive(_poolId) {
        Pool storage pool = pools[_poolId];
        
        require(
            msg.sender == pool.creator || block.timestamp >= pool.deadline,
            "Not authorized to cancel"
        );

        pool.isActive = false;
        emit PoolCancelled(_poolId, msg.sender);
    }

    // ============ VIEW FUNCTIONS ============

    /// @notice Get basic pool info (ID, creator, name, status, etc.)
    /// @param _poolId The ID of the pool
    /// @return id Pool ID
    /// @return creator Pool creator address
    /// @return name Pool name
    /// @return deadline Pool deadline (timestamp)
    /// @return isActive Whether the pool is active
    /// @return isCompleted Whether the pool is completed
    function getPoolBasicInfo(uint256 _poolId)
        external
        view
        poolExists(_poolId)
        returns (
            uint256 id,
            address creator,
            string memory name,
            uint256 deadline,
            bool isActive,
            bool isCompleted
        )
    {
        Pool storage pool = pools[_poolId];
        return (
            pool.id,
            pool.creator,
            pool.name,
            pool.deadline,
            pool.isActive,
            pool.isCompleted
        );
    }

    /// @notice Get financial info (target, current amount, contribution amount)
    /// @param _poolId The ID of the pool
    /// @return targetAmount Funding target
    /// @return currentAmount Current funds raised
    /// @return contributionAmount Minimum contribution amount
    function getPoolFinancialInfo(uint256 _poolId)
        external
        view
        poolExists(_poolId)
        returns (
            uint256 targetAmount,
            uint256 currentAmount,
            uint256 contributionAmount
        )
    {
        Pool storage pool = pools[_poolId];
        return (
            pool.targetAmount,
            pool.currentAmount,
            pool.contributionAmount
        );
    }

    /// @notice Get member info (max members, current members)
    /// @param _poolId The ID of the pool
    /// @return maxMembers Maximum allowed members
    /// @return currentMembers Current number of contributors
    function getPoolMemberInfo(uint256 _poolId)
        external
        view
        poolExists(_poolId)
        returns (
            uint256 maxMembers,
            uint256 currentMembers
        )
    {
        Pool storage pool = pools[_poolId];
        return (
            pool.maxMembers,
            pool.currentMembers
        );
    }

    /// @notice Get contributor list and their contributions
    /// @param _poolId The ID of the pool
    /// @return contributors List of contributor addresses
    /// @return contributions List of contribution amounts
    function getPoolContributors(uint256 _poolId)
        external
        view
        poolExists(_poolId)
        returns (
            address[] memory contributors,
            uint256[] memory contributions
        )
    {
        Pool storage pool = pools[_poolId];
        return (pool.contributors, pool.contributions);
    }

    /// @notice Get user's pools
    /// @param _user User address
    /// @return Array of pool IDs
    function getUserPools(address _user) external view returns (uint256[] memory) {
        return userPools[_user];
    }

    /// @notice Get total number of pools
    /// @return Total pool count
    function getPoolCount() external view returns (uint256) {
        return poolCount;
    }

    /// @notice Get contract balance
    /// @return Contract balance in wei
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Check if user has contributed to a pool
    /// @param _poolId Pool ID
    /// @param _user User address
    /// @return True if user has contributed
    function hasUserContributed(uint256 _poolId, address _user) external view poolExists(_poolId) returns (bool) {
        return hasContributed[_poolId][_user];
    }

    /// @notice Check if user has withdrawn from a pool
    /// @param _poolId Pool ID
    /// @param _user User address
    /// @return True if user has withdrawn
    function hasUserWithdrawn(uint256 _poolId, address _user) external view poolExists(_poolId) returns (bool) {
        return hasWithdrawn[_poolId][_user];
    }

    // ============ RECEIVE FUNCTION ============

    receive() external payable {
        // Accept ETH for pool contributions
    }
}
