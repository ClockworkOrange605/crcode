import { Link } from "react-router-dom"

import MainMenu from '../../components/App/Menus/MainMenu'
import UserMenu from '../../components/App/Menus/UserMenu'

import { useMetaMask } from "../../components/App/Auth/MetaMask"

import './Header.css'

function Header() {
  const { address } = useMetaMask()

  return (
    <header>
      <div className="Logo">
        <Link to="/">Creative Coding NFT's</Link>
        <MainMenu />
      </div>
      <div className="Account">
        <Avatar address={address} />
        {address && <UserMenu />}
      </div>
    </header>
  )
}

function Avatar({ address }) {
  const { status, connect } = useMetaMask()

  return (
    <p className="Address">
      {status === 'initializing' &&
        <span>Initializing...</span>}

      {status === 'connecting' &&
        <span>Connecting...</span>}

      {status === 'unavailable' &&
        <span><a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask Required</a></span>}

      {status === 'notConnected' &&
        <span onClick={connect}>Connect</span>}

      {status === 'connected' &&
        <span style={{ color: '#888888' }}>
          0x
          <span style={{ 'color': 'var(--primary-account-color)' }}>
            {address.slice(2, 8)}
          </span>
          . . .
          <span style={{ 'color': 'var(--secondary-account-color)' }}>
            {address.slice(-6)}
          </span>
        </span>}

      <span className="Avatar"></span>
    </p>
  )
}

export default Header