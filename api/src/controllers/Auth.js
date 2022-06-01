import { recoverAddress } from '../utils/eth.js'
import { signToken } from '../utils/jwt.js'

const Authorize = (req, res) => {
  const { address } = req.params
  const { signature } = req.body

  try {
    const account = recoverAddress(`${address}@CreativeCoding`, signature)

    if (account == address) {
      const token = signToken(account)
      res.send({ account, token })
    } else
      res.status(401).send({ error: 'Invalid signature' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

}

const checkAuthorization = (req, res) => {
  const { address } = req.params

  if (res.locals.account === address)
    res.send(res.locals)
  else
    res.status(401).send({ error: 'Invalid token' })
}

export { Authorize, checkAuthorization }