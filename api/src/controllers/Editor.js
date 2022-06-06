import { listFolder, upload, save, rename, remove } from '../utils/fs.js'
import { createFile, createFolder } from '../utils/fs.js'

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

const saveItem = async (req, res) => {
  const { id } = req.params
  const { file } = req.query

  const root = `/storage/artworks/${id}/sources`
  try {
    const blob = Buffer.from(req.body)
    await save(root, file, blob)
    res.send({ status: 'ok' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const uploadItem = async (req, res) => {
  const { id } = req.params
  const { path, name, filename } = req.query

  const root = `/storage/artworks/${id}/sources`
  try {
    const file = Buffer.from(req.body)
    await upload(root, path, name, filename, file)
    res.send(await listFolder(root))
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const createItem = async (req, res) => {
  const { id } = req.params
  const { parent, name, dir } = req.body

  const root = `/storage/artworks/${id}/sources`

  try {
    dir ?
      await createFolder(root, parent.path, parent.name, name) :
      await createFile(root, parent.path, parent.name, name)

    res.send(await listFolder(root))
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

export { getFileList, saveItem, uploadItem, createItem, renameItem, removeItem }