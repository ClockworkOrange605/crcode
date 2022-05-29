import fs from 'fs'

import { copyFolder } from '../utils/fs.js'

import { create } from '../models/Artwork.js'

const list = (req, res) => {
  try {
    const templates = JSON.parse(fs.readFileSync('/storage/templates/templates.json'))
    res.send(Object.values(templates))
  } catch {
    res.status(403).send({ error: error.message })
  }
}

const copy = async (req, res) => {
  const { template, version } = req.params
  const { account } = res.locals

  try {
    const id = await create({ account, template, version })

    copyFolder(
      `/storage/templates/${template}/sources/${version}/*`,
      `/storage/artworks/${id}/source/`
    )

    res.send({ id })
  } catch {
    res.status(403).send({ error: error.message })
  }
}

export { list, copy }