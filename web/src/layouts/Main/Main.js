import { useEffect } from "react"

import Header from "./Header"
import Footer from "./Footer"

import { useMetaMask } from "../../components/App/Auth/MetaMask"

import './Main.css'

const Main = ({ children }) => {
  const { address } = useMetaMask()

  useEffect(() => {
    // Set Color Scheme
    if (address) {
      document.documentElement.style.setProperty(
        '--primary-account-color', `#${address.slice(2, 8)}`
      )
      document.documentElement.style.setProperty(
        '--secondary-account-color', `#${address.slice(-6)}`
      )
    } else {
      // return defaults after logout
      document.documentElement.style.setProperty('--primary-account-color', '#111111')
      document.documentElement.style.setProperty('--secondary-account-color', '#aaaaaa')
    }
  }, [address])

  return (
    <div className="App">
      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Main