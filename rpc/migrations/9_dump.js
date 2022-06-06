const NFT = artifacts.require("NFT")

async function main(deployer, network, accounts) {
  const instance = await NFT.deployed()
  await dumpContract(instance)
}

async function dumpContract(instance) {
  // const supply = await instance.totalSupply()
  console.log('Contract Deployed:', await instance.address)
  console.log('==========================================')
  console.log('Name:', await instance.name())
  console.log('Symbol:', await instance.symbol())
  // console.log('Supply:', supply.toNumber())
  console.log('==========================================')
}

module.exports = main