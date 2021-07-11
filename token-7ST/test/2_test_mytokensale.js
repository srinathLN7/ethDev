const token = artifacts.require('MyToken');
const tokenSale = artifacts.require('MyTokenSale');
const kyc = artifacts.require('KYC');

const chai = require('./setup_chai.js');
const expect = chai.expect
const BN = web3.utils.BN;

require('dotenv').config({path: '../.env'});

contract("Token Sale test", async accounts => {

    const [initialHolder, recipient] = accounts;

    it("All tokens transferred from miters account to crowdsale contract", async () => {
        let instance = await token.deployed();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));

    });  


    it("Tokensale contract should have all pre-minted tokens", async () => {
        let tokenInstance = await token.deployed();
        let totalSupply = await tokenInstance.totalSupply();
        let balanceOfTokenSaleContract = await tokenInstance.balanceOf(tokenSale.address);

        //return expect(tokenInstance.balanceOf(tokenSale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
        return expect(balanceOfTokenSaleContract).to.be.a.bignumber.equal(totalSupply);    
    });


    it("Possibility to send ether to smart contract and buy tokens", async () => {
        let tokenInstance = await token.deployed();
        let tokenSaleInstance = await tokenSale.deployed();
        let kycInstance = await kyc.deployed();

        // Balance before sending ether in recipient account 
        let _balanceBeforeInRecipientAcc = await tokenInstance.balanceOf(recipient);

        // Since kyc is not set to be completed yet - promise is expected to be rejected
        await  expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
        
        await kycInstance.setKYCCompleted(recipient);
        await  expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(_balanceBeforeInRecipientAcc.add(new BN(1))).to.be.a.bignumber.equal(await tokenInstance.balanceOf(recipient)); 
    });

});


