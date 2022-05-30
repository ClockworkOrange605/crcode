import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { list, get, copy } from '../controllers/Templates.js'

const router = new Router()

router.get('/', list)
router.get('/:slug', get)

router.post('/:template/:version/copy', AuthMiddleware, copy)

export default router