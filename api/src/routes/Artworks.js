import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { checkAccess } from '../middlewares/Artworks.js'
import { list, get, generateMedia, updateMetadata, uploadSources, getSignMessage, setSourcesAccessConditions, getDecryptionKey, downloadSources } from '../controllers/Artworks.js'

const router = new Router()

router.use(AuthMiddleware)

router.get('/', list)
router.get('/:id', checkAccess, get)
router.post('/:id/generate', checkAccess, generateMedia)
router.post('/:id/metadata', checkAccess, updateMetadata)

router.get('/:id/sources/message', checkAccess, getSignMessage)
router.post('/:id/sources/upload', checkAccess, uploadSources)
router.post('/:id/sources/conditions', checkAccess, setSourcesAccessConditions)
router.post('/:id/sources/decryption', checkAccess, getDecryptionKey)
router.post('/:id/sources/download', checkAccess, downloadSources)

export default router