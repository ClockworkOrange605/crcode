import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { checkAccess } from '../middlewares/Artworks.js'

import { getFileList as getFileTree } from '../controllers/Editor.js'
import { renameItem, removeItem } from '../controllers/Editor.js'

const router = new Router()

router.use(AuthMiddleware)

router.get('/:id/files', checkAccess, getFileTree)

router.post('/:id/actions/rename', checkAccess, renameItem)
router.post('/:id/actions/remove', checkAccess, removeItem)

export default router