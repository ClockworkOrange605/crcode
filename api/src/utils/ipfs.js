import config from '../../config/main.js'
import fetch, { fileFromSync } from 'node-fetch'

import fs from 'fs'
import { Writable } from 'stream'

import { filesFromPaths } from 'files-from-path'
import { CAREncoderStream, createDirectoryEncoderStream } from 'ipfs-car'

const uploadFile = async (filepath) => {
  const file = fileFromSync(filepath)

  const resp = await fetch(`${config.ipfs.nft_storage.uri}/upload`,
    {
      method: 'POST',
      headers: { "Authorization": `Bearer ${config.ipfs.nft_storage.key}` },
      body: file
    }
  )
  const data = await resp.json()

  return `ipfs://${data.value.cid}`
}

const uploadJSON = async (json) => {
  const resp = await fetch(`${config.ipfs.nft_storage.uri}/upload`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.ipfs.nft_storage.key}`
      },
      body: JSON.stringify(json, null, '  ')
    }
  )
  const data = await resp.json()

  return `ipfs://${data.value.cid}`
}

// npx ipfs-car pack /storage/artworks/6508a4d0bb914380e76c6013/sources/ --output=/storage/artworks/6508a4d0bb914380e76c6013/6508a4d0bb914380e76c6013.car
const packCar = async (path, car) => {
  const files = await filesFromPaths([path])

  await createDirectoryEncoderStream(files)
    .pipeThrough(new CAREncoderStream(car))
    .pipeTo(Writable.toWeb(fs.createWriteStream(car)))
}

// npx ipfs-car unpack /storage/artworks/6508a4d0bb914380e76c6013/QmePjsjdBejmNHB6UxP5nFosww3QqjcjP4qtHGxtv9ifZz --output /storage/artworks/6508a4d0bb914380e76c6013/car/
const unpackCar = () => {}

export { uploadFile, uploadJSON, packCar, unpackCar }