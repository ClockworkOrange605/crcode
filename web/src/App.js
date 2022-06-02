import MetaMaskProvider from "./components/App/Auth/MetaMask"
import AuthProvider from "./components/App/Auth/Auth"

import Layout from './components/layouts/main/Main'
import Router from './components/App/Router'

function App() {
  return (
    <MetaMaskProvider>
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
      </AuthProvider >
    </MetaMaskProvider>
  )
}

export default App