
var MyToken = artifacts.require('./MyToken.sol');  
var MyTokenSale = artifacts.require('./MyTokenSale') //.sol extension is optional
require('dotenv').config({path: '../.env'});

module.exports = async deployer => {
        let addr = await web3.eth.getAccounts();

        await deployer.deploy(MyToken, process.env.INITIAL_TOKEN_SUPPLY);
        await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address); // Token rate = 1 wei/token

        let tokenInstance = await MyToken.deployed();
        await tokenInstance.transfer(MyTokenSale.address, process.env.INITIAL_TOKEN_SUPPLY);
}