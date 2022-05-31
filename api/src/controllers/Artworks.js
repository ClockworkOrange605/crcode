import { find, update } from '../models/Artwork.js'

import { recordPage } from '../utils/chromium.js'
import { uploadFile, uploadJSON } from '../utils/ipfs.js'

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

const metadata = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params
  const { metadata } = req.body

  const url = `/preview/${id}/media`
  const path = `/storage/artworks/${id}/media`

  const [animation_url, image_url] = [
    `${url}/${metadata.animation}`,
    `${url}/${metadata.image}`
  ]

  const [animation_hash, image_hash] = await Promise.all([
    await uploadFile(`${path}/${metadata.animation}`),
    await uploadFile(`${path}/${metadata.image}`)
  ])

  delete metadata.animation
  const metadataFile = {
    ...metadata,
    image: image_hash,
    animation_url: animation_hash
  }

  const metadata_hash = await uploadJSON(metadataFile)
  const metadata_url = metadata_hash.replace('ipfs://', 'https://ipfs.io/ipfs/')

  await update(id, {
    image_url, animation_url,
    metadata: metadataFile,
    metadata_hash, metadata_url
  })

  res.send({ id, metadata_url })
}

export { get, generate, metadata }