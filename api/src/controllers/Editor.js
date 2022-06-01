import { findById as findArtwork } from '../models/Artwork.js'
import { listFolder } from '../utils/fs.js'

const getFileList = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    // TODO: move to middleware
    const artwork = await findArtwork(id)
    if (account !== artwork.account) {
      res.status(403).send({ error: "Forbidden" })
      return
    }

    const path = `/storage/artworks/${id}/sources`
    const data = await listFolder(path)

    res.send(data)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { getFileList }