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

export { get }