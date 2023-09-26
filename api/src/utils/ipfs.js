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

// npx ipfs-car pack /path --output=file.car
const packCar = (path, car) =>
  pack(path, { output: car })

// npx ipfs-car unpack file.car --output /path
const unpackCar = (car, path) =>
  unpack(car, { output: path })

export { uploadFile, uploadJSON }
export { packCar, unpackCar }