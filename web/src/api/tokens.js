import { request } from "../utils/api"

const list = async () =>
  request(`/collection/tokens/`)

const get = async (id) =>
  request(`/collection/tokens/${id}/`)

export { list, get }