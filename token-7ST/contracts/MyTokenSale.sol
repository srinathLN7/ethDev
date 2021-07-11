// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "./Crowdsale.sol";
import "./KYC.sol";

contract MyTokenSale is Crowdsale {

KYC _kyc; 

constructor( uint256 rate, address payable wallet, IERC20 token, KYC kyc) 

Crowdsale(rate, wallet, token) 

public {
    _kyc = kyc;
 } 


function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
    super._preValidatePurchase(beneficiary, weiAmount);
    require(_kyc.isKYCComplete(beneficiary), "KYC is not complete. Aborting!" );
    }

}
