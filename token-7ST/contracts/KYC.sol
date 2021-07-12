// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYC is Ownable{

    mapping (address => bool) kycMap;

    function setKYCComplete(address addr) public onlyOwner {
        kycMap[addr] = true;
    }

    function setKYCRevoke(address addr) public onlyOwner {
        kycMap[addr] = false;
    }

    function isKYCComplete(address addr) public view returns (bool) {
        return kycMap[addr];
    }

}