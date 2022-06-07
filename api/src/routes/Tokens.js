import { Router } from 'express'

import { getTokensList, getToken } from '../controllers/Tokens.js'

const router = new Router()

router.get('/tokens', getTokensList)
router.get('/tokens/:id', getToken)

export default router