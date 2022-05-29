import { verifyToken } from '../utils/jwt.js'

const VerifyAuth = (req, res, next) => {
  const { "x-auth-token": token } = req.headers

  try {
    res.locals.account = verifyToken(token)

    next()
  }
  catch (error) {
    res.status(403).send({ error: error.message })
  }
}

export { VerifyAuth as AuthMiddleware }