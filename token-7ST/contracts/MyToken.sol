// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    
 constructor(uint256 initialSupply) ERC20("Seven Star Chai Token", "7ST") public {
 _mint(msg.sender, initialSupply);
 _setupDecimals(0);
 }
 
}