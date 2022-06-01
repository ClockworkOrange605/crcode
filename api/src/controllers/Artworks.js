import {
  find as findArtworks,
  findById as findArtwork,
  updateById as updateArtwork
} from '../models/Artwork.js'

import { uploadFile, uploadJSON } from '../utils/ipfs.js'
import { recordPage } from '../utils/chromium.js'

const list = async (req, res) => {
  const { account } = res.locals

  try {
    const artworks = await findArtworks({ account })
    res.send(artworks)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const get = async (req, res) => {
  const { id } = req.params

  try {
    const artwork = await findArtwork(id)
    res.send(artwork)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const generateMedia = async (req, res) => {
  const { id } = req.params

  const host = 'http://localhost:4000'
  const url = `/preview/${id}/sources/index.html`
  const path = `/storage/artworks/${id}/media/`

  try {
    await recordPage(`${host}${url}`, path)
    await updateArtwork(id, { status: 'finished' })

    res.send({ id, status: 'finished' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const updateMetadata = async (req, res) => {
  const { id } = req.params
  const { metadata } = req.body

  const image_url = `/preview/${id}/media/${metadata.image}`
  const animation_url = `/preview/${id}/media/${metadata.animation}`

  const path = `/storage/artworks/${id}/media`

  try {
    const [animation_hash, image_hash] = await Promise.all([
      await uploadFile(`${path}/${metadata.animation}`),
      await uploadFile(`${path}/${metadata.image}`)
    ])

    delete metadata.animation
    const metadataFile = { ...metadata, image: image_hash, animation_url: animation_hash }

    const metadata_hash = await uploadJSON(metadataFile)
    await updateArtwork(id, {
      status: 'ready',
      metadata: metadataFile,
      metadata_hash,
      image: image_url,
      video: animation_url
    })

    res.send({ id, status: 'ready' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { list, get, generateMedia, updateMetadata }