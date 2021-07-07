// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./ItemManager.sol";

contract Item {
    
    uint public _index;
    uint public _priceInWei;
    uint public _paidInWei;
    
    ItemManager _parentContract;
    
    constructor(ItemManager parentContract, uint priceInWei, uint index) public {
        _parentContract=parentContract;
        _priceInWei=priceInWei;
        _index=index;
    }
    
    
    receive() external payable {
    require(_priceInWei == msg.value, "Only full payments accepted");
    require(_paidInWei == 0 , "Item already paid for");
    _paidInWei += msg.value;    
    (bool success, ) = address( _parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", _index));
    require(success, "Payment failed.");
    }
    
    fallback() external {
        
    }
    
}