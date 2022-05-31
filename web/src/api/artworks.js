const get = async (id, account) => {
  const token = sessionStorage.getItem(account)

  const response = await fetch(`/artworks/${id}/`,
    {
      headers: {
        'x-auth-token': token
      }
    }
  )

  return response.json()
}

const generate = async (id, account) => {
  const token = sessionStorage.getItem(account)

  const response = await fetch(`/artworks/${id}/generate`,
    {
      method: 'POST',
      headers: {
        'x-auth-token': token
      }
    }
  )

  return response.json()
}

const metadata = async (id, account, data) => {
  const token = sessionStorage.getItem(account)

  const response = await fetch(`/artworks/${id}/metadata`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(data)
    }
  )

  return response.json()
}

export { get, generate, metadata }