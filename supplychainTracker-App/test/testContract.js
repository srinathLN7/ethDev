const ItemManagerContract = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
  it("... should let you create new Items.", async () => {
    const itemManagerInstance = await ItemManagerContract.deployed();
    const itemName = "book7";
    const itemPrice = "7";

    const result = await itemManagerInstance.createItem(itemName, itemPrice, {from : accounts[0]});
    assert.equal(result.logs[0].args._index, 0, "Item index missing or mismatch");

    
    const item = await itemManagerInstance.itemMapping(0);
    assert.equal(item._identifier, itemName, "Item identifier mismatch");
    }
  );
});