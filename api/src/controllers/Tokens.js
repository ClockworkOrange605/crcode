import { find, findById } from "../models/Token.js"

const getTokens = async (req, res) => {
  const { filter, sort, limit } = req.body

  try {
    res.send(await find(filter, sort, limit))
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

//TODO: depricated
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

export { getTokens, getTokensList, getToken }