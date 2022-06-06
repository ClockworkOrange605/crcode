import { findById as findArtwork } from '../models/Artwork.js'
import { getMintTx } from '../utils/contract.js'

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

export { mintTransaction }