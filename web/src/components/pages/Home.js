import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../App/Loader/Loader'

import './Home.css'

function Home() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(false)
    }

    load()
  }, [])

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Home">
          <div className="Block">
            <h2><Link to="/collection/">Latests</Link></h2>

            <div className="Tokens">
              {tokens.map(token => (
                <Link to={`/collection/${token.id}`}>
                  <div className="Item">
                    <img width="250" src={token?.metadata?.image} alt="" />
                    <p style={{ "line-height": "28px", "padding-bottom": "20px" }}>
                      #{token.id} {token?.metadata?.name}

                      <span style={{ color: '#888888', float: 'left' }}>
                        0x
                        <span style={{ 'color': `#${token.owner.slice(2, 8)}` }}>
                          {token.owner.slice(2, 8)}
                        </span>
                        . . .
                        <span style={{ 'color': `#${token.owner.slice(-6)}` }}>
                          {token.owner.slice(-6)}
                        </span>
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="Block">
            <h2><Link to="/collection?on_sale=true">On Sale</Link></h2>
            <div className="Tokens"></div>
          </div>

          <div className="Block">
            <h2><Link to="/collection?on_auction=true">On Auction</Link></h2>
            <div className="Tokens"></div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Home