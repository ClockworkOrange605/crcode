import { listFolder, rename, remove } from '../utils/fs.js'

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

const renameItem = async (req, res) => {
  const { id } = req.params
  const { item, name } = req.body

  const root = `/storage/artworks/${id}/sources`

  try {
    await rename(root, item.path, item.name, name)
    res.send(await listFolder(root))
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const removeItem = async (req, res) => {
  const { id } = req.params
  const { item } = req.body

  const root = `/storage/artworks/${id}/sources`

  try {
    await remove(root, item.path, item.name)
    res.send(await listFolder(root))
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { getFileList, renameItem, removeItem }