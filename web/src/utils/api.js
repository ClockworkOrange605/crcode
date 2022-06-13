const request = async (url, options) => (
  await fetch('/api' + url, options)
).json()

const authorizedRequest = async (url, options = {}) => {
  if (!options?.headers) options.headers = {}
  options.headers['x-auth-token'] = sessionStorage.getItem('auth')

  return (await fetch('/api' + url, options)).json()
}

export { request, authorizedRequest }