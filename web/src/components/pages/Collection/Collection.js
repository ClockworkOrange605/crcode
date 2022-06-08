import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import { list as getTokens } from '../../../api/tokens'

import Loader from '../../App/Loader/Loader'

import './styles/Collection.css'

const Collection = () => {
  const [tokens, setTokens] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setTokens(await getTokens())
      setLoading(false)
    }

    load()
  }, [])

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Collection">
          <div className="Filter">
            <div>
              <h2>Status</h2>
              <div>
                <label for="on_sale">On sale</label>
                <input type="checkbox" id="on_sale" />
              </div>
              <div>
                <label for="on_sale">On Auction</label>
                <input type="checkbox" id="on_auction" />
              </div>
              <div>
                <label for="on_sale">Has offers</label>
                <input type="checkbox" id="has_offers" />
              </div>
            </div>

            <div>
              <h2>Holders</h2>
              <div className="Creator">
                <label for="creator">Creator</label>
                <input type="text" id="creator" placeholder="0x..." />
              </div>
              <div className="Owner">
                <label for="creator">Owner</label>
                <input type="text" id="owner" placeholder="0x..." />
              </div>
            </div>

            <div>
              <h2>Attributes</h2>
              <div>
                <label for="library">library</label>
                <select id="library">
                  <option value={0} selected>any</option>
                  <option value={'none'}>none</option>
                  <option value={'p5'}>p5.js</option>
                </select>
              </div>
            </div>
          </div>
          <div className="List">
            {tokens.map(token =>
              <Link to={`/collection/${token.id}`}>
                <div className="Item">
                  <img width="250" src={token?.metadata?.image} alt="" />
                  <p style={{ "line-height": "28px", "padding-bottom": "20px" }}>
                    #{token.id} {token?.metadata?.name}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Collection