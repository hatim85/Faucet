// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet {
    address public owner;
    uint256 public constant FIXED_AMOUNT = 0.5 ether; // Assuming 500 GSMC tokens with 18 decimals
    IERC20 public token;
    uint256 public withdrawalLimit;
    uint256 public requestAmount;
    mapping(address => uint256) public lastWithdrawalTime;

    event TokensRequested(address indexed requester, uint256 amount);

    constructor(address _tokenAddress, uint256 _withdrawalLimit) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
        withdrawalLimit = _withdrawalLimit;
    }

     function getRequestAmount() external view returns (uint256) {
        return requestAmount;
    }

    function requestTokens() external {
        require(FIXED_AMOUNT <= withdrawalLimit, "Amount exceeds withdrawal limit");
        require(token.balanceOf(address(this)) >= FIXED_AMOUNT, "Insufficient contract balance");
        // require(block.timestamp - lastWithdrawalTime[msg.sender] >= 1 days, "Can only withdraw once every 24 hours");

        lastWithdrawalTime[msg.sender] = block.timestamp;
        token.transfer(msg.sender, FIXED_AMOUNT);

        emit TokensRequested(msg.sender, FIXED_AMOUNT);
    }

    function deposit(uint256 _amount) external onlyOwner {
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function setWithdrawalLimit(uint256 _newLimit) external onlyOwner {
        withdrawalLimit = _newLimit;
    }

    function withdrawAll() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner, balance);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
