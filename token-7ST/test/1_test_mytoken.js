const token = artifacts.require('MyToken');
const chai = require('./setup_chai.js');
const expect = chai.expect
const BN = web3.utils.BN;

require('dotenv').config({path: '../.env'});


contract("Token Test", async accounts => {

    const [initialHolder, recipient, anotherAccount] = accounts;

    /* beforeEach() is introduced in this testcase suit so as
       to exclusively test the MyToken smart contract.     
    */
    beforeEach( async () => {
        this.myToken = await token.new(process.env.INITIAL_TOKEN_SUPPLY);
    });

    it("Total supply should be in minters account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);

        //let balance = await instance.balanceOf.call(initialHolder);
        //assert.equal(balance.valueOf(), 0, "Account 1 has a balance");
    });

    it("Able to send tokens from sender to recipient", async () => {
        let instance = this.myToken;
        let sendTokens = 1000;
        let totalSupply = await instance.totalSupply();
        // Before transfer
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);

        // After transfer
        await expect(instance.transfer(recipient, sendTokens)).to.be.eventually.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.be.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });


    it("Cannot send more tokens than total supply", async () => {
        let instance = this.myToken;
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        
        await expect(instance.transfer(recipient, balanceOfAccount+ new BN(1))).to.be.eventually.rejected;
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
    });


});