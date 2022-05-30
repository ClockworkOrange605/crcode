import { find } from '../models/Artwork.js'

const get = async (req, res) => {
  const { account } = res.locals
  const { id } = req.params

  try {
    const artwork = await find(id)

    if (account === artwork.account)
      res.send(artwork)
    else
      res.status(403).send({ error: "Not Authorized" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { get }