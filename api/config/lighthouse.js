export default {
  api_key: process.env.LIGHTHOUSE_API_KEY || 'generate_your_key',
  filecoin_chain: process.env.FILECOIN_CHAIN || 'calibration',
  evm_chain: process.env.EVM_CHAIN || 'Mumbai',
}