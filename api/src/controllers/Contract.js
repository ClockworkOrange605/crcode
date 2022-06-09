import { findById as findArtwork, updateById as updateArtwork }
  from '../models/Artwork.js'
import { create as createToken } from '../models/Token.js'
import { getMintTx, getMintTxData } from '../utils/contract.js'

//TODO: refactor
import fetch from 'node-fetch'

const mintTransaction = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    const { metadata_hash } = await findArtwork(id)
    const tx = await getMintTx(account, metadata_hash)

    res.send({ tx })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const mintTransactionCheck = async (req, res) => {
  const { id, hash } = req.params

  try {
    const { transaction, token } = await getMintTxData(hash)

    //TODO: refactor && cache media
    const metadataRequest = await fetch(
      token.uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
    const metadata = await metadataRequest.json()

    await createToken({ artwork_id: id, ...token, metadata })
    await updateArtwork(id, { token_id: token.id, status: 'minted' })

    res.send({ transaction, token })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { mintTransaction, mintTransactionCheck }