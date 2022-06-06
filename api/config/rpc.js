export default {
  contract: {
    address: process.env.CONTRACT_ADDRESS || '0x0',
    mint_price: '100000000000000000',
  },
  uri: process.env.EVM_RPC || 'http://localhost:9545'
}