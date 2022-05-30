import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { get, generate } from '../controllers/Artworks.js'

const router = new Router()

router.get('/:id', AuthMiddleware, get)
router.post('/:id/generate', AuthMiddleware, generate)

export default router