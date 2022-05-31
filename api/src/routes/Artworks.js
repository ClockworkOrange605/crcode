import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { get, generate, metadata } from '../controllers/Artworks.js'

const router = new Router()

router.get('/:id', AuthMiddleware, get)
router.post('/:id/generate', AuthMiddleware, generate)
router.post('/:id/metadata', AuthMiddleware, metadata)

export default router