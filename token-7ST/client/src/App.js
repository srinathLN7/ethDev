import React, { Component } from "react";
import TokenContract from "./contracts/MyToken.json";
import TokenSaleContract from "./contracts/MyTokenSale.json";
import KYCContract from "./contracts/KYC.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = {loaded: false, kycAddress: "0x777...", tokenSaleAddress: null, userTokens: 0, noOfTokens: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      //this.networkId = await this.web3.eth.net.getId();
      this.networkId = await this.web3.eth.getChainId();
      
      console.log(' Network ID is ' + this.networkId)
      
      this.myToken = new this.web3.eth.Contract(
        TokenContract.abi,
        TokenContract.networks[this.networkId] && TokenContract.networks[this.networkId].address,
      );

      this.myTokenSale = new this.web3.eth.Contract(
        TokenSaleContract.abi,
        TokenSaleContract.networks[this.networkId] && TokenSaleContract.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KYCContract.abi,
        KYCContract.networks[this.networkId] && KYCContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listentoTokenTransfer();
      this.setState({loaded: true, tokenSaleAddress: this.myTokenSale._address}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  updateUserTokens = async () => {
  let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
  this.setState({userTokens: userTokens});
  
  };

  listentoTokenTransfer = () => {
    this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }


  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
    [name]: value
    });
    }

  handleKYCSubmit = async () => {
    const { kycAddress } = this.state;
    await  this.kycInstance.methods.setKYCComplete(kycAddress).send({from: this.accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted")
  }

  handleBuyToken = async () => {
    await this.myTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.state.noOfTokens})
  }
  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to 7ST Hot Chai Inc.</h1>
        <h2>Get your 7ST tokens. Enjoy your drink!</h2>
        
        <h2> Enable your account</h2>
        Address <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKYCSubmit}> Submit </button> 
        <p> Send Ether to this address to buy 7ST tokens: {this.state.tokenSaleAddress}</p>
        <p> You currently have {this.state.userTokens} in your account</p>
        Number of Tokens <input type="text" name="noOfTokens" value={this.state.noOfTokens} onChange={this.handleInputChange}/> 
        <button type="button" onClick={this.handleBuyToken}> Buy token </button>
      </div>
    );
  }
  

}

export default App;
