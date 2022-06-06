import { config, web3, contract } from '../rpc.js'

const getMintTx = async (address, metadata) => {
  const method = await contract.methods.mint(address, metadata)

  // TODO: estimate normal gas price
  // const gasPrice = '20000000000'

  return {
    from: address,
    to: config.address,
    gas: web3.utils.toHex((await method.estimateGas()).toString()),
    // gasPrice: web3.utils.toHex(gasPrice),
    value: web3.utils.toHex(config.mint_price),
    data: await method.encodeABI()
  }
}

export { getMintTx }