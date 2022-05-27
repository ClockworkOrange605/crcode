import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { Authorize } from '../controllers/Auth.js'

const router = new Router()

router.get('/:address', AuthMiddleware, (req, res) => res.send(res.locals))

router.post('/:address', Authorize)

export default router