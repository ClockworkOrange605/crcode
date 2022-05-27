import Layout from './layouts/Main/Main'
import Router from './components/App/Router'

import MetaMaskProvider from "./components/App/Auth/MetaMask"

function App() {
  return (
    <MetaMaskProvider>
      <Layout>
        <Router />
      </Layout>
    </MetaMaskProvider>
  )
}

export default App