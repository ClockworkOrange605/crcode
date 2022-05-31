export default {
  infura: {
    uri: 'https://ipfs.infura.io:5001',
    id: process.env.INFURA_IPFS_ID || 'set_your_id',
    secret: process.env.INFURA_IPFS_SECRET || 'set_your_secret'
  },
  nft_storage: {
    uri: 'https://api.nft.storage',
    key: process.env.NFT_STORAGE_KEY || 'SET_UP_KEY',
  }
}