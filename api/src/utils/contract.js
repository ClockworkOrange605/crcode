import { config, web3, contract } from '../rpc.js'

const getMintTx = async (address, metadata) => {
  const method = await contract.methods.mint(address, metadata)

  return {
    from: address,
    to: config.address,
    gas: (await method.estimateGas()).toString(),
    data: await method.encodeABI()
    //TODO: make mint method payable
    // value: web3.utils.toHex(config.mint_price),
  }
}

const getMintTxData = async (hash) => {
  const tx = await web3.eth.getTransactionReceipt(hash)

  if (tx?.status) {
    const id = web3.utils.hexToNumber(tx.logs[0].topics[3])
    const token = {
      id,
      owner: await contract.methods.ownerOf(id).call(),
      uri: await contract.methods.tokenURI(id).call()
    }
    return { tx, token }
  }

  return { tx, token: {} }
}

export { getMintTx, getMintTxData }