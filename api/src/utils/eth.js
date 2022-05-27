import ethSigUtils from 'eth-sig-util'

const recoverAddress =
  (message, signature) =>
    ethSigUtils.recoverPersonalSignature({ data: message, sig: signature })

export { recoverAddress }