import { request, authorizedRequest } from "../utils/api"

const auth = async (address, signature) =>
  request(`/auth/${address}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ signature })
  })

const check = async (address) =>
  authorizedRequest(`/auth/${address}`)

export { auth, check }