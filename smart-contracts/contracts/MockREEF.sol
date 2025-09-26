// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MockREEF
 * @dev Mock REEF token for testing PoolFi contracts
 * @author PoolFi Team
 * @notice This contract provides a mock REEF token for testing purposes
 * @dev Includes faucet functionality and additional testing features
 */
contract MockREEF is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18; // 1000 tokens per faucet call
    uint256 public constant MAX_FAUCET_PER_DAY = 10000 * 10**18; // 10k tokens per day per address
    
    mapping(address => uint256) public lastFaucetTime;
    mapping(address => uint256) public dailyFaucetAmount;
    
    event FaucetUsed(address indexed user, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor() ERC20("Mock REEF", "mREEF") Ownable(msg.sender) {
        // Mint 10,000,000 tokens to the deployer for demo purposes
        _mint(msg.sender, 10000000 * 10**18);
    }
    
    /**
     * @dev Mint tokens to a specific address (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Get test tokens from faucet (anyone can call for demo)
     * Limited to FAUCET_AMOUNT per call and MAX_FAUCET_PER_DAY per address per day
     */
    function getTestTokens() external whenNotPaused {
        require(totalSupply() + FAUCET_AMOUNT <= MAX_SUPPLY, "Faucet exhausted");
        
        uint256 currentTime = block.timestamp;
        uint256 dayStart = (currentTime / 86400) * 86400; // Start of current day
        
        // Reset daily amount if it's a new day
        if (lastFaucetTime[msg.sender] < dayStart) {
            dailyFaucetAmount[msg.sender] = 0;
        }
        
        require(dailyFaucetAmount[msg.sender] + FAUCET_AMOUNT <= MAX_FAUCET_PER_DAY, "Daily faucet limit exceeded");
        
        lastFaucetTime[msg.sender] = currentTime;
        dailyFaucetAmount[msg.sender] += FAUCET_AMOUNT;
        
        _mint(msg.sender, FAUCET_AMOUNT);
        emit FaucetUsed(msg.sender, FAUCET_AMOUNT);
    }
    
    /**
     * @dev Get large amount of test tokens (only owner)
     * @param to Address to send tokens to
     * @param amount Amount of tokens to send
     */
    function getLargeTestTokens(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to include pause functionality
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to include pause functionality
     */
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Get faucet information for an address
     * @param user Address to check
     * @return canUseFaucet Whether user can use faucet now
     * @return nextAvailableTime When user can next use faucet (if limited)
     * @return dailyAmountUsed How much user has used today
     */
    function getFaucetInfo(address user) external view returns (
        bool canUseFaucet,
        uint256 nextAvailableTime,
        uint256 dailyAmountUsed
    ) {
        uint256 currentTime = block.timestamp;
        uint256 dayStart = (currentTime / 86400) * 86400;
        
        if (lastFaucetTime[user] < dayStart) {
            dailyAmountUsed = 0;
        } else {
            dailyAmountUsed = dailyFaucetAmount[user];
        }
        
        canUseFaucet = dailyAmountUsed + FAUCET_AMOUNT <= MAX_FAUCET_PER_DAY && 
                      totalSupply() + FAUCET_AMOUNT <= MAX_SUPPLY;
        
        if (!canUseFaucet && dailyAmountUsed + FAUCET_AMOUNT > MAX_FAUCET_PER_DAY) {
            nextAvailableTime = dayStart + 86400; // Next day
        } else {
            nextAvailableTime = 0;
        }
    }
    
    /**
     * @dev Get contract statistics
     * @return totalSupply_ Current total supply
     * @return maxSupply_ Maximum supply
     * @return faucetAmount_ Amount per faucet call
     * @return maxFaucetPerDay_ Maximum faucet per day per address
     */
    function getStats() external view returns (
        uint256 totalSupply_,
        uint256 maxSupply_,
        uint256 faucetAmount_,
        uint256 maxFaucetPerDay_
    ) {
        return (totalSupply(), MAX_SUPPLY, FAUCET_AMOUNT, MAX_FAUCET_PER_DAY);
    }
}
