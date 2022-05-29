const list = async () => {
  const response = await fetch('/templates')
  return response.json()
}

const copy = async (account, slug, version) => {
  const token = sessionStorage.getItem(account)

  const response = await fetch(`/templates/${slug}/${version}/copy/${account}`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': token
      }
    }
  )

  return response.json()
}

export { list, copy }