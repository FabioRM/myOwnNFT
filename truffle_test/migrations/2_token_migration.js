const MyOwnNft = artifacts.require("MyOwnNft");

module.exports = function(deployer) {
    deployer.deploy(MyOwnNft);
};