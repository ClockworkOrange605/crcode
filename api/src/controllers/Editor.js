import { listFolder } from '../utils/fs.js'

const getFileList = async (req, res) => {
  const { id } = req.params

  try {
    const path = `/storage/artworks/${id}/sources`
    const data = await listFolder(path)

    res.send(data)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { getFileList }