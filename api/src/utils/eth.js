import ethSigUtils from 'eth-sig-util'
import Web3 from 'web3'

const recoverAddress =
  (message, signature) =>
    ethSigUtils.recoverPersonalSignature({ data: message, sig: signature })

const objectIdtoUint256 = (_id) =>
  Web3.utils.toBN(
    Web3.utils.asciiToHex(_id)
  )

export { recoverAddress }
export { objectIdtoUint256 }