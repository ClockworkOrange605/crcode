import fs from 'fs'

import { copyFolder } from '../utils/fs.js'

import { create } from '../models/Artwork.js'

const list = (req, res) => {
  try {
    const templates = JSON.parse(fs.readFileSync('/storage/templates/templates.json'))
    res.send(Object.values(templates))
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const get = (req, res) => {
  const { slug } = req.params
  try {
    const templates = JSON.parse(fs.readFileSync('/storage/templates/templates.json'))
    res.send(templates[slug])
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const copy = async (req, res) => {
  const { template, version } = req.params
  const { account } = res.locals

  try {
    const id = await create({ account, template, version })

    copyFolder(
      `/storage/templates/${template}/sources/${version}/**`,
      `/storage/artworks/${id}/sources/`
    )

    res.send({ id })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

export { list, get, copy }