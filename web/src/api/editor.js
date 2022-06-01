import { authorizedRequest } from "../utils/api"

const getFiles = async (id) =>
  authorizedRequest(`/editor/${id}/files/`)

export { getFiles }