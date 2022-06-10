import { request } from "../utils/api"

const list = async (body) =>
  request(`/collection/tokens/`)

const filter = async (body) =>
  request(`/collection/tokens/filter/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

const get = async (id) =>
  request(`/collection/tokens/${id}/`)

export { list, filter, get }