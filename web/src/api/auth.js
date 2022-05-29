const auth = async (address, signature) => {
  const response = await fetch(`/auth/${address}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ signature })
  })

  return response.json()
}

const check = async (address) => {
  const response = await fetch(`/auth/${address}`, {
    headers: { 'x-auth-token': sessionStorage.getItem(address) }
  })

  return response.json()
}

export { auth, check }