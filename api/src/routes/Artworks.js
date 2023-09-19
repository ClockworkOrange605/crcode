import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { checkAccess } from '../middlewares/Artworks.js'
import { list, get, generateMedia, updateMetadata, uploadSources, getSignMessage, setConditions } from '../controllers/Artworks.js'

const router = new Router()

router.use(AuthMiddleware)

router.get('/', list)
router.get('/:id', checkAccess, get)
router.post('/:id/generate', checkAccess, generateMedia)
router.post('/:id/metadata', checkAccess, updateMetadata)

router.get('/:id/message', checkAccess, getSignMessage)
router.post('/:id/sources', checkAccess, uploadSources)
router.post('/:id/conditions', checkAccess, setConditions)

export default router