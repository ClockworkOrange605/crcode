import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { checkAccess } from '../middlewares/Artworks.js'

import { getFileList as getFileTree } from '../controllers/Editor.js'

const router = new Router()

router.use(AuthMiddleware)

router.get('/:id/files', checkAccess, getFileTree)

export default router