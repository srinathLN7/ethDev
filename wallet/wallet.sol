pragma solidity ^0.5.13;

import "./allowance.sol";

contract Wallet is Allowance {
    event moneyWithdrawn(address indexed _byAddr, uint _amount);
    event moneyReceived(address indexed _toAddr, uint _amount);
    
    // Withdraw function to withdraw money
    function withdraw(address payable _toAddr, uint _amount) public ownerOrAllowance(_amount) {
        require(_amount <= allowance[msg.sender], "Insufficient funds in the account");
        if (!isOwner()) {
            reduceAllowance(msg.sender, _amount);
        }
        _toAddr.transfer(_amount);
        emit moneyWithdrawn(msg.sender, _amount);
    }
    
    function renounceOwnership() public onlyOwner {
        revert("Cannot renounce ownership in this contract");
    }
    
    // Fallback function to receive money
    function () external payable {
        emit moneyReceived(msg.sender, msg.value);
    }
}
