import config from '../config/main.js'

import fs from 'fs'
import Web3 from 'web3'

const web3 = new Web3(config.rpc.uri)

const contractConfig = config.rpc.contract
const contractAbi = JSON.parse(fs.readFileSync('/storage/contracts/NFT.json')).abi
const contractInstance = new web3.eth.Contract(contractAbi, contractConfig.address)

export { web3, contractInstance as contract, contractConfig as config }