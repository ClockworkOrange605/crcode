import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { get } from '../controllers/Artworks.js'

const router = new Router()


router.get('/:id', AuthMiddleware, get)

export default router