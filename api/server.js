import express from 'express'

const api = express()

api.get('/', (req, res) => {
  res.send({ timestamp: Date.now() })
})

api.listen(4000, () => {
  console.log(`Example app listening at http://localhost:${4000}`)
})