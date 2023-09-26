import express from 'express'

import AuthRouter from './src/routes/Auth.js'
import TemplatesRouter from './src/routes/Templates.js'
import ArtworksRouter from './src/routes/Artworks.js'
import EditorRouter from './src/routes/Editor.js'
import ContractRouter from './src/routes/Contract.js'
import CollectionRouer from './src/routes/Tokens.js'

const api = express()

api.use(express.json())
api.use(express.raw({ limit: "25Mb", type: "*/*" }))

api.get('/api/', (req, res) => { res.send({ timestamp: Date.now() }) })

api.use('/api/auth', AuthRouter)
api.use('/api/templates', TemplatesRouter)
api.use('/api/artworks', ArtworksRouter)
api.use('/api/editor', EditorRouter)
api.use('/api/contract', ContractRouter)
api.use('/api/collection', CollectionRouer)

//TODO: add auth middlware (Make sure preview page keep working)
api.use('/preview', express.static('/storage/artworks'))
api.use('/cache', express.static('/storage/cache'))

api.listen(4000, () => {
  console.log(`API listening at http://localhost:${4000}`)
})