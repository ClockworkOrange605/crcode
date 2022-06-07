import { find, findById } from "../models/Token.js"

const getTokensList = async (req, res) => {
  try {
    res.send(await find())
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

const getToken = async (req, res) => {
  const { id } = req.params

  try {
    res.send(await findById(id))
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { getTokensList, getToken }