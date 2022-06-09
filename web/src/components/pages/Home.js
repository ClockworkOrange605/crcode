import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// TODO: change method
import { list as getLatest } from '../../api/tokens'

import Loader from '../App/Loader/Loader'

import './Home.css'

function Home() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const tokens = await getLatest()
      setTokens(tokens)

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
                <Link to={`/collection/${token.id}`} key={token._id}>
                  <div className="Item">
                    <img width="250" alt={token?.metadata?.name}
                      src={token?.metadata?.image
                        .replace('ipfs://', 'https://ipfs.io/ipfs/')} />
                    <p>#{token.id} {token?.metadata?.name}</p>
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