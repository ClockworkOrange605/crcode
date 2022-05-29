import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { Authorize, checkAuthorization } from '../controllers/Auth.js'

const router = new Router()

router.get('/:address', AuthMiddleware, checkAuthorization)

router.post('/:address', Authorize)

export default router