import { verifyToken } from '../utils/jwt.js'

const VerifyAuth = (req, res, next) => {
  const { address } = req.params
  const { "x-auth-token": token } = req.headers

  try {
    res.locals.account = verifyToken(token)

    if (res.locals.account === address)
      next()
    else
      res.status(403).send({ error: 'Invalid token' })
  }
  catch (error) {
    res.status(403).send({ error: error.message })
  }
}

export { VerifyAuth as AuthMiddleware }