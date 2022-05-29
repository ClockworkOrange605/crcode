import express from 'express'

import AuthRouter from './src/routes/Auth.js'
import TemplatesRouter from './src/routes/Templates.js'

const api = express()

api.use(express.json())

api.use('/auth', AuthRouter)
api.use('/templates', TemplatesRouter)

api.get('/', (req, res) => { res.send({ timestamp: Date.now() }) })

api.listen(4000, () => {
  console.log(`Example app listening at http://localhost:${4000}`)
})