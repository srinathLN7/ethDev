// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable {
    
    enum status{Created, Paid, Delivered}    
    
    struct S_Item {
        Item _item;
        string _identifier;
        uint _priceInWei;
        status _status;
    }
    
    mapping(uint => S_Item) public itemMapping;
    uint public _index;
    
    event supplychainEvent(uint _index, uint _step, address _address);
    
    function createItem(string memory _identifier, uint _priceInWei) public onlyOwner {
        Item _item=new Item(this, _priceInWei,_index);
        itemMapping[_index]._item=_item;
        itemMapping[_index]._identifier=_identifier;
        itemMapping[_index]._priceInWei=_priceInWei;
        itemMapping[_index]._status=status.Created;
        emit supplychainEvent(_index, uint(itemMapping[_index]._status),address(_item));
        _index++;
    }
    
    
    function triggerPayment(uint _itemIndex) public payable {
        require(itemMapping[_itemIndex]._priceInWei == msg.value, "Only full payments accepted.");
        require(itemMapping[_itemIndex]._status == status.Created, "Item not yet created.");
        itemMapping[_itemIndex]._status=status.Paid;
        emit supplychainEvent(_itemIndex, uint(itemMapping[_itemIndex]._status),address(itemMapping[_itemIndex]._item));
    }
    
    
    function triggerDelivery(uint _itemIndex) public onlyOwner{
        require(itemMapping[_itemIndex]._status == status.Paid, "Item needs to be paid for before shipping.");
        itemMapping[_itemIndex]._status=status.Delivered;
        emit supplychainEvent(_itemIndex, uint(itemMapping[_itemIndex]._status),address(itemMapping[_itemIndex]._item));        
    }
    
}