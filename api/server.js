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

api.use('/auth', AuthRouter)
api.use('/templates', TemplatesRouter)
api.use('/artworks', ArtworksRouter)
api.use('/editor', EditorRouter)
api.use('/contract', ContractRouter)
api.use('/collection', CollectionRouer)

//TODO: add auth middlware (Make sure preview page keep working)
api.use('/preview', express.static('/storage/artworks'))

api.get('/', (req, res) => { res.send({ timestamp: Date.now() }) })

api.listen(4000, () => {
  console.log(`Example app listening at http://localhost:${4000}`)
})