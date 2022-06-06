import { Router } from 'express'

import { AuthMiddleware } from '../middlewares/Auth.js'
import { checkAccess } from '../middlewares/Artworks.js'

import { mintTransaction } from '../controllers/Contract.js'

const router = new Router()

router.use(AuthMiddleware)

router.get('/transactions/mint/:id', checkAccess, mintTransaction)
// router.post('/transactions/mint/:id/:hash', checkAccess, mintTransactionProcessing)

export default router