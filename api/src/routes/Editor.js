import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { getFileList } from '../controllers/Editor.js'

const router = new Router()

router.get('/:id/files', AuthMiddleware, getFileList)

export default router