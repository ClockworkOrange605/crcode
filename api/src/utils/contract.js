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
  //TODO: check getPendingTransactions method
  const transaction = await web3.eth.getTransactionReceipt(hash)

  // TODO: refactor
  if (transaction === null) {
    console.log(transaction)
    return await getMintTxData(hash)
  }

  if (transaction?.status) {
    const id = web3.utils.hexToNumber(transaction.logs[0].topics[3])
    const events = await contract.getPastEvents("allEvents", { filter: { tokenId: id } })

    events.forEach(async (event) => {
      event.block = await web3.eth.getBlock(event.blockHash)
      event.transaction = await web3.eth.getTransactionReceipt(event.transactionHash)
    })

    const token = {
      id, events,
      contract: transaction.to,
      creator: transaction.from,
      owner: await contract.methods.ownerOf(id).call(),
      uri: await contract.methods.tokenURI(id).call(),
    }
    return { transaction, token }
  }

  return { transaction, token: {} }
}

export { getMintTx, getMintTxData }