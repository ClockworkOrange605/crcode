import { authorizedRequest } from "../utils/api"

const getMintTx = async (id) =>
  authorizedRequest(`/contract/transactions/mint/${id}/`)

const setMintTxHash = async (id, hash) =>
  authorizedRequest(`/contract/transactions/mint/${id}/${hash}/`, { method: 'POST' })

export { getMintTx, setMintTxHash }