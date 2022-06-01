import { findById as findArtwork } from '../models/Artwork.js'

const checkAccess = async (req, res, next) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    const artwork = await findArtwork(id, { projection: { account: true } })

    if (account !== artwork.account)
      res.status(403).send({ error: "Forbidden" })
    else
      next()
  }
  catch (error) {
    res.status(403).send({ error: error.message })
  }
}

export { checkAccess }