import config from '../../config/main.js'
import fetch, { fileFromSync } from 'node-fetch'

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

export { uploadFile, uploadJSON }