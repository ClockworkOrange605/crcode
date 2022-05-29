import { createContext, useContext, useMemo } from 'react'
import { useState } from 'react'

import { auth as AuthRequest, check as AuthCheckRequest } from '../../../api/auth'

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [account, setAccount] = useState()

  async function auth(address, signature) {
    const { account, token } = await AuthRequest(address, signature)
    sessionStorage.setItem(account, token)
    setAccount(account)
    return account
  }

  async function check(address) {
    const { account } = await AuthCheckRequest(address)
    setAccount(account)
    return account
  }

  const [connecting, setConnecting] = useState(false)
  const [authorizing, setAuthorizing] = useState(false)

  const stateMemo = useMemo(() => ({
    account,
    auth, check,
    setConnecting,
    setAuthorizing
  }), [account])

  return (
    <AuthContext.Provider value={stateMemo}>
      {children}
      <div className="Overlay" style={{
        visibility: (connecting || authorizing) ? 'visible' : 'hidden'
      }}>
        {connecting && <p>Connect To Metamask</p>}
        {authorizing && <p>Sign Message to continue</p>}
      </div>
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider
export { useAuth }