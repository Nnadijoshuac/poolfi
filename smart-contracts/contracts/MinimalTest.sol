// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MinimalTest
 * @dev Ultra-minimal contract to test Revive pallet limitations
 * @author PoolFi Team
 * @notice This contract has no dependencies and minimal functionality
 */
contract MinimalTest {
    uint256 public value;
    
    constructor() {
        value = 42;
    }
    
    function setValue(uint256 _value) external {
        value = _value;
    }
    
    function getValue() external view returns (uint256) {
        return value;
    }
}
