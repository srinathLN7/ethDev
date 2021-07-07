import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    // Initial state of the contract variables
    state = {cost: 0, itemName: "" , loaded: false}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      
      this.ItemManagerContract = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address,
      );

      this.ItemContract = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[networkId] && ItemContract.networks[networkId].address,
      );


      this.listenToPaymentEvent();
      this.setState({ loaded: true }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supplychain Tracker</h1>
       
        
        <h2>Add Item </h2>
        Cost in Wei: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange}/>
        Item Name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange}/>
        
        <button type="button" onClick={this.handleSubmit}> Create new Item </button>
      </div>
    );
  }

  handleSubmit = async() => {
    const {cost, itemName} = this.state;
    console.log(itemName, cost, this.ItemManagerContract);
    let result = await this.ItemManagerContract.methods.createItem(itemName, cost).send({from: this.accounts[0]});
    console.log(result);
    alert("Send" + cost + " Wei to " + result.events.supplychainEvent.returnValues._address);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({[name] : value});
  }

       
  listenToPaymentEvent = () => {
    let self = this;
    this.ItemManagerContract.events.supplychainEvent().on("data", async function(event) {
      if (event.returnValues._step == 1) {
        let item = await self.ItemManagerContract.methods.itemMapping(event.returnValues._index).call();
        console.log(item);
        alert("Item " + item._identifier + " was paid. Start Delivery!"); 
      }
       console.log(event);
    }
    )


}

}

export default App;
