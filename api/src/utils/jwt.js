import config from '../../config/main.js'

import jwt from 'jsonwebtoken'

const signToken =
  (account) => jwt.sign({ account }, config.auth.secret)

const verifyToken =
  (token) => jwt.verify(token, config.auth.secret).account

export { signToken, verifyToken }