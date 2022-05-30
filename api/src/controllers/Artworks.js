import { find } from '../models/Artwork.js'
import { recordPage } from '../utils/chromium.js'

const get = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    const artwork = await find(id)

    if (account === artwork.account)
      res.send(artwork)
    else
      res.status(403).send({ error: "Not Authorized" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const generate = async (req, res) => {
  const { id } = req.params
  const { account } = res.locals

  //TODO: move host to config
  const url = `${'http://localhost:4000'}/preview/${id}/sources/index.html`
  const path = `/storage/artworks/${id}/media/`

  try {
    await recordPage(url, path)
    res.send({ status: 'ok' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { get, generate }