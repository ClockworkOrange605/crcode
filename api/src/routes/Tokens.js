import { Router } from 'express'

import { getTokens, getTokensList, getToken } from '../controllers/Tokens.js'

const router = new Router()

router.get('/tokens', getTokensList)
router.post('/tokens/filter/', getTokens)
router.get('/tokens/:id', getToken)

export default router