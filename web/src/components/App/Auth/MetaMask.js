import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const MetaMaskContext = createContext({})

function MetaMaskProvider({ children }) {
  const [status, setStatus] = useState('initializing')
  const [address, setAddress] = useState()
  const [ethereum, setRpc] = useState()

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask)
      setRpc(window.ethereum)
    else
      setStatus('unavailable')
  }, [])

  useEffect(() => {
    ethereum && check()
    ethereum && ethereum.on('accountsChanged', () => { window.location.reload() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum])

  const connect = async () => {
    setStatus('connecting')
    await ethereum.request({ method: "eth_requestAccounts" })
    setAddress(ethereum.selectedAddress)
    setStatus('connected')
  }

  const check = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" })
    setAccounts(accounts)
  }

  const setAccounts = (accounts) => {
    if (!accounts.length) {
      setAddress(null)
      setStatus('notConnected')
    } else {
      setAddress(accounts[0])
      setStatus('connected')
    }
  }

  const context = useMemo(() => ({
    status, address, ethereum, connect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [status, address, ethereum])

  return (
    <MetaMaskContext.Provider value={context}>
      {children}
    </MetaMaskContext.Provider>
  )
}

const useMetaMask =
  () => useContext(MetaMaskContext)

export default MetaMaskProvider
export { useMetaMask }
