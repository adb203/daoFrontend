const MyContract = artifacts.require("../contracts/MyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};
