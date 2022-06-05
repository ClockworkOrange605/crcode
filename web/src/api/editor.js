import { authorizedRequest } from "../utils/api"

const getFiles = async (id) =>
  authorizedRequest(`/editor/${id}/files/`)

const upload = async (id, data, query) =>
  authorizedRequest(`/editor/${id}/actions/upload/?${query}`, {
    method: 'POST',
    body: data
  })

const create = async (id, data) =>
  authorizedRequest(`/editor/${id}/actions/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

const rename = async (id, data) =>
  authorizedRequest(`/editor/${id}/actions/rename/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

const remove = async (id, data) =>
  authorizedRequest(`/editor/${id}/actions/remove/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

export { getFiles, upload, create, rename, remove }