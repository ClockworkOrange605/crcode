const getFiles = async (id, account) => {
  const token = sessionStorage.getItem(account)

  const response = await fetch(`/editor/${id}/files/`,
    {
      headers: {
        'x-auth-token': token
      }
    }
  )

  return response.json()
}

export { getFiles }