const NFT = artifacts.require("NFT");

async function main(deployer) {
  deployer.deploy(NFT, "Creative Coding NFT", "CRCODE")
}

module.exports = main