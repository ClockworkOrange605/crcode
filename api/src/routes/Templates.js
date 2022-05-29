import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { list, copy } from '../controllers/Templates.js'

const router = new Router()

router.get('/', list)

router.post('/:template/:version/copy/:address', AuthMiddleware, copy)

export default router