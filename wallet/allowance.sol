pragma solidity ^0.5.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/math/SafeMath.sol";

contract Allowance is Ownable {
    
    // SafeMath is a just library and not a contract.
    using SafeMath for uint;
    
    mapping (address => uint) allowance;
    event  allowanceChange(address indexed _toAddr, address indexed _fromAddr, uint _oldAmt, uint _newAmt);
    
    modifier ownerOrAllowance(uint _amountToWithdraw) {
        require(isOwner() || allowance[msg.sender] >= _amountToWithdraw, "You are not allowed");
        _;
    }
    
    function addAllowance(address _allowanceAddr, uint _amount) public onlyOwner {
        emit allowanceChange(_allowanceAddr, msg.sender, allowance[_allowanceAddr], _amount);
        allowance[_allowanceAddr] = _amount;
    }
    
    function reduceAllowance(address _allowanceAddr, uint _amount) internal {
        emit allowanceChange(_allowanceAddr, msg.sender, allowance[_allowanceAddr], allowance[_allowanceAddr].sub( _amount));
        allowance[_allowanceAddr] = allowance[_allowanceAddr].sub( _amount);
    }
}