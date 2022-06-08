import { Fragment, useState, useEffect } from "react"
import { useParams, useLocation } from 'react-router'

import { request } from "../../../utils/api"
import { get as getToken } from '../../../api/tokens'

import Loader from '../../App/Loader/Loader'

import './styles/Token.css'

const Token = () => {
  const { id } = useParams()
  const location = useLocation()

  const [token, setToken] = useState()
  const [metadata, setMetadata] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const token = await getToken(id)
      const metadata = await request(
        token.uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))

      setToken(token)
      setMetadata(metadata)

      setLoading(false)
    }

    load()
  }, [id])

  useEffect(() => {
    if (!loading && location.hash) {
      if (document.querySelector(location.hash)) {
        document.querySelector('.TabContents > .selected').classList.remove('selected')
        document.querySelector(`.TabLinks > .selected`).classList.remove('selected')

        document.querySelector(location.hash).classList.add('selected')
        document.querySelector(`.TabLinks > a[href="${location.hash}"]`)
          .classList.add('selected')
      }
    }
  }, [location, loading])

  const toggleFullscreen = () =>
    document.querySelector('#Artwork').classList.toggle('fullscreen')

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Token">
          <div className="Info">
            <picture>
              <img alt={metadata.name}
                src={metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
            </picture>

            <div className="Links">
              <a target="_blank" rel="noreferrer"
                href={`https://polygonscan.com/token/0xd50d167dd35d256e19e2fb76d6b9bf9f4c571a3e?a=${id}`}
              >
                <i className="icon polygonscan" />
              </a>
              <a target="_blank" rel="noreferrer"
                href={token.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              >
                <i className="icon ipfs" />
              </a>
              <a target="_blank" rel="noreferrer"
                href={`https://opensea.io/assets/matic/0xd50d167dd35d256e19e2fb76d6b9bf9f4c571a3e/${id}`}
              >
                <i className="icon opensea" />
              </a>

              <a target="_blank" rel="noreferrer"
                href={`https://rarible.com/token/polygon/0xd50d167dd35d256e19e2fb76d6b9bf9f4c571a3e:${id}?tab=details`}
              >
                <i className="icon rarible" />
              </a>
            </div>

            <div className="Addresses">
              <div className="split">
                <div>Created by</div>
                <a href="#">0x
                  <span style={{ color: `#${token.owner.slice(2, 8)}` }}>
                    {token.owner.slice(2, 8)}
                  </span>
                  &nbsp;. . .&nbsp;
                  <span style={{ color: `#${token.owner.slice(-6)}` }}>
                    {token.owner.slice(-6)}
                  </span>
                </a>
              </div>

              <div className="split">
                <div>Owned by</div>
                <a href="#">
                  0x
                  <span style={{ color: `#${token.owner.slice(2, 8)}` }}>
                    {token.owner.slice(2, 8)}
                  </span>
                  &nbsp;. . .&nbsp;
                  <span style={{ color: `#${token.owner.slice(-6)}` }}>
                    {token.owner.slice(-6)}
                  </span>
                </a>
              </div>
            </div>

            <div className="Attributes">
              {metadata.attributes.map(item =>
                <a href="#" className="Attribute" key={item.trait_type} title={item.trait_type}>
                  <div className="trait">{item.trait_type.replace('_', ' ')}</div>
                  <div className="value">{item.value.replace('_', ' ')}</div>
                </a>
              )}
            </div>
          </div>

          <div className="Details">
            <div className="Header">
              <h1>#{token.id} {metadata.name}</h1>
              <button className="BidButton">make offer</button>
            </div>


            <div className="Description">
              <p>{metadata.description}</p>
            </div>

            <div className="Tabs">
              <div className="TabLinks">
                <a href="#Preview" className="selected">Preview</a>
                <a href="#Artwork">Artwork</a>
                <a href="#Sources">Sources</a>
              </div>
              <div className="TabContents">
                <div id="Preview" className="selected">
                  <video width="600" muted autoPlay loop controls controlsList="nodownload"
                    src={metadata.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
                </div>

                <div id="Artwork">
                  <div className="Actions">
                    <i className="icon fullscreen" onClick={toggleFullscreen}></i>
                  </div>
                  <iframe width="600" height="335" title={metadata.name}
                    src={`${'http://localhost:9005'}/preview/${'629efca474e74a13573accba'}/sources/${'index.html'}`} />
                </div>

                <div id="Sources">
                  <div className="Actions">
                    <i className="icon download"></i>
                  </div>
                  <i>Sources goes here</i>
                </div>
              </div>
            </div>

            <div className="Events">
              <h2>Token Events</h2>
              <div>
                <div>
                  <div>Minted</div>
                  <div>Minted by 0x</div>
                  <div>11/7/2021, 11:00 AM </div>
                </div>
                <div>
                  <div>Transfered</div>
                  <div>Transfered to 0x</div>
                  <div>11/7/2021, 11:00 AM </div>
                </div>
                <div>
                  <div>Minted</div>
                  <div>Minted by 0x</div>
                  <div>11/7/2021, 11:00 AM </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </Fragment >
  )
}

export default Token