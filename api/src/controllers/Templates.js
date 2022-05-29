import fs from 'fs'

import { copyFolder } from '../utils/fs.js'

const list = (req, res) => {
  try {
    const templates = JSON.parse(fs.readFileSync('/storage/templates/templates.json'))
    res.send(Object.values(templates))
  } catch {
    res.status(403).send({ error: error.message })
  }
}

const copy = (req, res) => {
  const { slug, version } = req.params
  const { account } = res.locals

  const id = 0

  copyFolder(
    `/storage/templates/${slug}/sources/${version}/*`,
    `/storage/artworks/${id}/sources/`
  )

  res.status(501).send({ id })
}

export { list, copy }