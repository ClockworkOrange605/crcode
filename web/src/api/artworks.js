import { authorizedRequest } from "../utils/api"

const list = async () =>
  authorizedRequest(`/artworks/`)

const get = async (id) =>
  authorizedRequest(`/artworks/${id}/`)

const generateMedia = async (id) =>
  authorizedRequest(`/artworks/${id}/generate`, {
    method: 'POST'
  })

const updateMetadata = async (id, data) =>
  authorizedRequest(`/artworks/${id}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const getMessage = async (id) =>
    authorizedRequest(`/artworks/${id}/message`)

  const uploadSources = async (id, data) =>
    authorizedRequest(`/artworks/${id}/sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

  const setAccessConditions = async (id, data) =>
    authorizedRequest(`/artworks/${id}/conditions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })


export {
  list, get, generateMedia as generate, updateMetadata as metadata,
  getMessage, uploadSources, setAccessConditions
}