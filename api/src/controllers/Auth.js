import { recoverAddress } from '../utils/eth.js'
import { signToken } from '../utils/jwt.js'

const Authorize = (req, res) => {
  const { address } = req.params
  const { signature } = req.body

  const account = recoverAddress(`${address}@CreativeCoding`, signature)

  if (account == address) {
    const token = signToken(account)
    res.send({ account, token })
  } else
    res.status(403).send({ error: 'Invalid signature' })
}

const checkAuthorization = (req, res) => {
  const { address } = req.params

  if (res.locals.account === address)
    res.status(403).send({ error: 'Invalid token' })
  else
    res.send(res.locals)
}

export { Authorize, checkAuthorization }