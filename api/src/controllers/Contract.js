import { findById as findArtwork, updateById as updateArtwork }
  from '../models/Artwork.js'
import { create as createToken } from '../models/Token.js'
import { getMintTx, getMintTxData } from '../utils/contract.js'

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
    const { tx, token } = await getMintTxData(hash)

    await createToken({ ...token, transaction: tx })
    await updateArtwork(id, { status: 'minted', token_id: token.id })

    res.send({ tx, token })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { mintTransaction, mintTransactionCheck }