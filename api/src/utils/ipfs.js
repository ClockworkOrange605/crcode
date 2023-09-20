import config from '../../config/main.js'
import fetch, { fileFromSync } from 'node-fetch'

import pack from 'ipfs-car/cmd/pack.js'
import unpack from 'ipfs-car/cmd/unpack.js'

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
  await pack(path, {output: car})
}

// npx ipfs-car unpack /storage/cache/429a75fc3cebe23c504d7df3fdd64892de0f4b3597e781168d177d16aa6e3959.car --output /storage/cache/429a75fc3cebe23c504d7df3fdd64892de0f4b3597e781168d177d16aa6e3959/
const unpackCar = async (car, path) => {
  await unpack(car, {output: path})
}

export { uploadFile, uploadJSON, packCar, unpackCar }