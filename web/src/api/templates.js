import { request, authorizedRequest } from "../utils/api"

const list = async () =>
  request('/templates')

const get = async (slug) =>
  request(`/templates/${slug}`)

const copy = async (slug, version) =>
  authorizedRequest(`/templates/${slug}/${version}/copy/`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' }
  })

export { list, get, copy }