import {
  find as findArtworks,
  findById as findArtwork,
  updateById as updateArtwork
} from '../models/Artwork.js'

import { recordPage } from '../utils/chromium.js'
import { packCar, unpackCar, uploadFile, uploadJSON } from '../utils/ipfs.js'
import { decryptSources, getEncriptionKey, getMessage, setAccessConditions, uploadEncriptedFolder } from '../utils/lighthouse.js'

import {appendFileSync, writeFileSync} from 'fs'

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

const getSignMessage = async (req, res) => {
  const { account } = res.locals

  try {
    const message = await getMessage(account)
    res.send({ message })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const getDecryptionKey = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params
  const { signature, cid } = req.query

  try {
    const key = await getEncriptionKey(cid, account, signature)

    res.send({ id, key })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }

}

const uploadSources = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params
  const { signature } = req.body

  const path = `/storage/artworks/${id}/sources/`
  const car = `/storage/artworks/${id}/${id}.car`

  try {
    await packCar(path, car)

    const cid = await uploadEncriptedFolder(car, account, signature)

    await updateArtwork(id, { car: cid, status: "encrypted" })

    res.send({ id, cid, status: "encrypted" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const downloadSources = async (req, res) => {
  const { id } = req.params
  const { cid, key } = req.query

  const car = `/storage/cache/${key}.car`
  const path = `/storage/cache/${key}/`

  try {
    const sources = await decryptSources(cid, key)
    writeFileSync(car, Buffer.from(sources))

    await unpackCar(car, path)

    res.send({ id, car })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const setConditions = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params
  const { signature, cid } = req.body

  try {
    // TODO: check success
    await setAccessConditions(cid, account, signature)

    await updateArtwork(id, { car: cid, status: "protected" })

    res.send({ id, status: "protected" })
  } catch (err) {
    res.status(500).send({ error: err })
  }
}

export { list, get, generateMedia, updateMetadata }
export{ getSignMessage, getDecryptionKey, uploadSources, downloadSources, setConditions }