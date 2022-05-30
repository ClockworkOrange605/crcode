import { listFolder } from '../utils/fs.js'

import { find } from '../models/Artwork.js'

const getFileList = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    const artwork = await find(id)

    if (account !== artwork.account)
      res.status(403).send({ error: "Not Authorized" })

    const path = `/storage/artworks/${id}/sources`
    const data = await listFolder(path)

    res.send(data)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { getFileList }