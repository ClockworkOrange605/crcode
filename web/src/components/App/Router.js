import { useEffect } from "react"

import { Routes, Route } from "react-router-dom"

import { useMetaMask } from "../../components/App/Auth/MetaMask"
import { useAuth } from "../../components/App/Auth/Auth"

import Templates from "../Account/Artworks/Create"
import IDE from "../Account/Artworks/Editor"
import Metadata from "../Account/Artworks/Update"
import Mint from '../Account/Artworks/Publish'

const Router = () => {
  return (
    <Routes>
      <Route
        path="/account"
        element={<RequireAuth>Under the Development</RequireAuth>}
      />

      <Route
        path="/account/artworks"
        element={<RequireAuth>Under the Development</RequireAuth>}
      />
      <Route
        path="/account/artworks/create"
        element={<RequireAuth><Templates /></RequireAuth>}
      />
      <Route
        path="/account/artworks/:id/editor"
        element={<RequireAuth><IDE /></RequireAuth>}
      />
      <Route
        path="/account/artworks/:id/metadata"
        element={<RequireAuth><Metadata /></RequireAuth>}
      />
      <Route
        path="/account/artworks/:id/publish"
        element={<RequireAuth><Mint /></RequireAuth>}
      />

      <Route
        path="/account/collection"
        element={<RequireAuth>Under the Development</RequireAuth>}
      />

      <Route
        path="*"
        element={<p>Not Found - 404 Page</p>}
      />
    </Routes>
  )
}

const RequireAuth = ({ children }) => {
  const { address, ethereum, connect } = useMetaMask()
  const { account, check, auth, setConnecting, setAuthorizing } = useAuth()

  useEffect(() => {
    async function authorize() {
      if (!address && ethereum) {
        setConnecting(true)
        await connect()
        setConnecting(false)
      }

      if (address) {
        setConnecting(false)
      }

      if (address && !account)
        if (!await check(address)) {
          setAuthorizing(true)

          const signature = await ethereum.request({
            method: 'personal_sign', from: address,
            params: [`${address}@CreativeCoding`, address]
          })
          await auth(address, signature)

          setAuthorizing(false)
        }
    }

    authorize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum, address, account])

  return account ? children : <p></p>
}

export default Router