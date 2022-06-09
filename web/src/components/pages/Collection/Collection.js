import { Fragment, useEffect, useState } from "react"
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import { list as getTokens } from '../../../api/tokens'

import Loader from '../../App/Loader/Loader'

import './styles/Collection.css'

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [tokens, setTokens] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setTokens(await getTokens())
      setLoading(false)
    }

    load()
  }, [])

  const ChangeFilter = (event) => {
    const current = searchParams

    switch (event.target.type) {
      case 'checkbox':
        event.target.checked ?
          current.set(event.target.name, event.target.checked) :
          current.delete(event.target.name)
        break
      case 'select-one':
        event.target.value != 0 ?
          current.set(event.target.name, event.target.value) :
          current.delete(event.target.name)
        break
      // case 'text':
      //   console.log(event.target.name, event.target.value)
      //   break
    }

    setSearchParams(current)
  }

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Collection">
          <div className="Filter">
            <div style={{ position: 'fixed', width: '320px' }}>
              <div className="Group">
                <h2>Status</h2>
                <div className="Item">
                  <label htmlFor="on_sale">On Sale</label>
                  <input name="on_sale" id="on_sale" type="checkbox"
                    defaultChecked={searchParams.get('on_sale')}
                    onChange={ChangeFilter}
                  />
                </div>
                <div className="Item">
                  <label htmlFor="on_sale">On Auction</label>
                  <input name="on_auction" id="on_auction" type="checkbox"
                    defaultChecked={searchParams.get('on_auction')}
                    onChange={ChangeFilter} />
                </div>
                <div className="Item">
                  <label htmlFor="on_sale">Has Offers</label>
                  <input name="has_offers" id="has_offers" type="checkbox"
                    defaultChecked={searchParams.get('has_offers')}
                    onChange={ChangeFilter}
                  />
                </div>
              </div>

              <div className="Group">
                <h2>Holders</h2>
                <div className="Item">
                  <label htmlFor="creator">Creator</label>
                  <input type="text" id="creator" placeholder="0x..." name="creator"
                    onChange={ChangeFilter}
                  />
                </div>
                <div className="Item">
                  <label htmlFor="owner">Owner</label>
                  <input type="text" id="owner" placeholder="0x..." name="owner"
                    onChange={ChangeFilter}
                  />
                </div>
              </div>

              <div className="Group">
                <h2>Attributes</h2>
                <div className="Item">
                  <label htmlFor="library">Library</label>
                  <select name="library" id="library"
                    defaultValue={searchParams.get('library')}
                    onChange={ChangeFilter}
                  >
                    <option value={0}>any</option>
                    <option value={'none'}>none</option>
                    <option value={'p5'}>p5.js</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="List">
            {tokens.map(token =>
              <Link to={`/collection/${token.id}`} key={token.id}>
                <div className="Item">
                  <img width="250" alt={token?.metadata?.name}
                    src={token?.metadata?.image
                      .replace('ipfs://', 'https://ipfs.io/ipfs/')} />
                  <p>
                    {token?.metadata?.name}
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