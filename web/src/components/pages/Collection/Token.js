import { Fragment, useState, useEffect } from "react"
import { useParams, useLocation } from 'react-router'
import { Link } from "react-router-dom"

import { useMetaMask } from "../../App/Auth/MetaMask"
import { useAuth } from "../../App/Auth/Auth"

import { get as getToken } from '../../../api/tokens'

import Loader from '../../App/Loader/Loader'

import './styles/Token.css'

const Token = () => {
  const { id } = useParams()
  const location = useLocation()

  const [token, setToken] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const token = await getToken(id)
      setToken(token)
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

  const smoothScroll = async (event) => {
    event.preventDefault()
    const target = event.target.attributes.href.value
    document.location.hash = target

    // const block = document.querySelector('.TabContents')
    // block.scrollIntoView(
    //   { behavior: "smooth", block: "end", inline: "end" })

  }

  const toggleFullscreen = () =>
    document.querySelector('#Artwork').classList.toggle('fullscreen')

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Token">
          <div className="Info">
            <picture>
              <img alt={token.metadata.name}
                src={token.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
            </picture>

            <div className="Links">
              <a target="_blank" rel="noreferrer"
                href={`https://polygonscan.com/token/${token.contract}?a=${id}`}
              >
                <i className="icon polygonscan" />
              </a>
              <a target="_blank" rel="noreferrer"
                href={token.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              >
                <i className="icon ipfs" />
              </a>
              <a target="_blank" rel="noreferrer"
                href={`https://opensea.io/assets/matic/${token.contract}/${id}`}
              >
                <i className="icon opensea" />
              </a>

              <a target="_blank" rel="noreferrer"
                href={`https://rarible.com/token/polygon/${token.contract}:${id}?tab=details`}
              >
                <i className="icon rarible" />
              </a>
            </div>

            <div className="Addresses">
              <div className="split">
                <div>Owned by</div>
                <a href="#">
                  <Address address={token.owner} />
                </a>
              </div>

              <div className="split">
                <div>Created by</div>
                <a href="#">
                  <Address address={token.creator} />
                </a>
              </div>
            </div>

            <div className="Attributes">
              {token.metadata.attributes.map(item =>
                <Link to={`/collection?${item.trait_type}=${item.value}`}
                  className="Attribute" key={item.trait_type} title={item.trait_type}>
                  <div className="trait">{item.trait_type}</div>
                  <div className="value">{item.value}</div>
                </Link>
              )}
            </div>
          </div>

          <div className="Details">
            <div className="Header">
              <h1>#{token.id} {token.metadata.name}</h1>
              <div className="Actions">
                <button className="BidButton">make offer</button>
              </div>
              {/* <AuthorizedBlock permitted={token.owner}
                message={(
                  <div className="Actions">
                    <button className="BidButton">make offer</button>
                    <button className="BidButton">make a bid</button>
                  </div>
                )}
              >
                <div className="Actions">
                  <button className="BidButton">accept offer</button>
                  <button className="BidButton">start auction</button>
                </div>
              </AuthorizedBlock> */}
            </div>

            <div className="Description">
              <p>{token.metadata.description}</p>
            </div>

            <div className="Tabs">
              <div className="TabLinks">
                <a href="#Preview" className="selected" onClick={smoothScroll}>Preview</a>
                <a href="#Artwork" onClick={smoothScroll}>Artwork</a>
                <a href="#Sources" onClick={smoothScroll}>Sources</a>
              </div>
              <div className="TabContents">
                <div id="Preview" className="selected">
                  <video width="600" muted controls controlsList="nodownload"
                    autoPlay
                    // loop
                    src={token.metadata.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
                </div>

                <div id="Artwork">
                  <AuthorizedBlock permitted={token.owner}
                    message={<i>Only token owner have access to artwork</i>}
                  >
                    <div className="Actions">
                      <i className="icon fullscreen" onClick={toggleFullscreen}></i>
                    </div>
                    <iframe width="600" height="335" title={token.metadata.name}
                      src={`${'http://localhost:9005'}/preview/${token.artwork_id}/sources/${'index.html'}`} />
                  </AuthorizedBlock>
                </div>

                <div id="Sources">
                  <AuthorizedBlock permitted={token.owner}
                    message={<i>Only token owner have access to source code</i>}
                  >
                    <Fragment>
                      <div className="Actions">
                        <i className="icon download"></i>
                      </div>
                      <i>Sources goes here</i>
                    </Fragment>
                  </AuthorizedBlock>
                </div>
              </div>
            </div>

            <TokenEvents events={token?.events} />
          </div>
        </div>
      )}
    </Fragment >
  )
}

const AuthorizedBlock = ({ children, permitted, message }) => {
  const { address, ethereum, connect } = useMetaMask()
  const { account, check, auth } = useAuth()

  useEffect(() => { address && check(address) }, [address])

  async function authorize() {
    const signature = await ethereum.request({
      method: 'personal_sign', from: address,
      params: [`${address}@CreativeCoding`, address]
    })
    await auth(address, signature)
  }

  return (
    <Fragment>
      {!address && (
        <Fragment>
          <i>
            <button onClick={connect}>Connect with MetaMask </button> to continue . . .
          </i>
        </Fragment>
      )}

      {address && !account && (
        <Fragment>
          <i>
            <button onClick={authorize}>Sign message </button> to continue . . .
          </i>
        </Fragment>
      )}

      {address && account &&
        account.toLowerCase() !== permitted.toLowerCase() && (
          <Fragment>
            {message}
          </Fragment>
        )}

      {address && account &&
        account.toLowerCase() === permitted.toLowerCase() && (
          <Fragment>
            {children}
          </Fragment>
        )}
    </Fragment>
  )
}

const TokenEvents = ({ events }) => {
  const [data, setData] = useState()

  //TODO: move to backend
  useEffect(() => {
    const eventsClone = events

    eventsClone.forEach(event => {
      event.type = (event.returnValues.from === "0x0000000000000000000000000000000000000000") ? 'Minted' : 'Transfered'
    })
    setData(eventsClone)
  }, [events])

  return (
    <div className="Events">
      {/* <h2>Token Events</h2> */}
      {data && data.map(event =>
        <div className={`Event ${event.type}`} key={event.transactionHash}>
          <div className="Title">
            <h3>{event.type}</h3>
            <div>
              <a target="_blank" rel="noreferrer"
                href={`https://polygonscan.com/tx/${event.transactionHash}`}>
                <div>at {(new Date(event.block.timestamp * 1000)).toLocaleString()}</div>
              </a>
            </div>
          </div>
          <div className="Description">
            {event.type === 'Minted' && (
              <Fragment>
                by&nbsp;
                <a href="#"><Address address={event.returnValues.to} /></a>
              </Fragment>
            )}

            {event.type === 'Transfered' && (
              <Fragment>
                from&nbsp;
                <a href="#"><Address address={event.returnValues.from} /></a>
                &nbsp;to&nbsp;
                <a href="#"><Address address={event.returnValues.to} /></a>
              </Fragment>
            )}
          </div>


        </div>
      )}
    </div>
  )
}

const Address = ({ address }) => {
  return (
    <Fragment>
      0x
      <span style={{ color: `#${address.slice(2, 8)}` }}>
        {address.slice(2, 8)}
      </span>
      &nbsp;. . .&nbsp;
      <span style={{ color: `#${address.slice(-6)}` }}>
        {address.slice(-6)}
      </span>
    </Fragment>
  )
}

export default Token