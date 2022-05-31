import { useEffect, useState, useRef } from 'react'

import { useParams, useNavigate } from 'react-router'

import { useMetaMask } from '../../../components/App/Auth/MetaMask'
import { useAuth } from "../../../components/App/Auth/Auth"

import { get as getArtwork } from '../../../api/artworks'

import Loader from '../../../components/App/Loader/Loader'

import * as monaco from 'monaco-editor'

import './Publish.css'

function Publish() {
  const navigate = useNavigate()

  const codeRef = useRef()

  const { address, ethereum } = useMetaMask()
  const { account } = useAuth()
  const { id } = useParams()

  const [data, setData] = useState()
  const [metadata, setMetadata] = useState()
  const [code, setCode] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)

    const data = await getArtwork(id, account)

    const response = await fetch(data.metadata_url)
    const metadata = await response.json()

    //ISSUE: https://github.com/microsoft/monaco-editor/issues/3105
    const code = await monaco.editor.colorize(
      JSON.stringify(metadata, null, '\t'), 'json', { tabSize: 2 })

    setData(data)
    setMetadata(metadata)
    setCode(code)

    setLoading(false)
  }

  //   async function publish() {
  //     //TODO: add env variables
  //     const chain = '0x539'

  //     //TODO: make account check
  //     if (address !== account) {
  //       return alert('wrong metamask account selected')
  //     }

  //     //TODO: make notification for wrong chain
  //     if (chainId !== chain) {
  //       return alert('wrong chain selected')
  //     }

  //     fetch(`/${account}/nft/${id}/mint`, {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //         'x-auth-token': sessionStorage.getItem(account)
  //       },
  //       body: JSON.stringify({ metadata: data.metadata_url })
  //     })
  //       .then(res => {
  //         console.log(res)
  //         res.json()
  //           .then(({ tx }) => {
  //             console.log(tx)

  //             ethereum.request({
  //               method: 'eth_sendTransaction',
  //               params: [tx],
  //             })
  //               .then(txId => {
  //                 fetch(`/collection/${txId}/status`)
  //                   .then(res =>
  //                     res.json()
  //                       .then(data => {
  //                          navigate(`/collection/${data.id}`)
  //                       })
  //                   )
  //               })
  //           })
  //       })
  //   }

  return (
    <div className="Publisher">
      {loading && <Loader />}

      {/* {!loading &&
        <div className="Header">
          <h1>Review Metadata and Publish</h1>
        </div>
      } */}

      {!loading &&
        <div className="Metadata">
          <h2>
            Metadata&nbsp;
            <a href={data?.metadata_url} target="_blank" rel="noreferrer">
              {data?.metadata_hash}
            </a>
          </h2>
          <code ref={codeRef} dangerouslySetInnerHTML={{ __html: code }}></code>
        </div>
      }

      {!loading &&
        <div className="Image">
          <h2>
            Image&nbsp;
            <a target="_blank" rel="noreferrer"
              href={metadata?.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            >{metadata?.image}</a>
          </h2>
          <img width="450" alt=""
            src={metadata?.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
        </div>
      }

      {!loading &&
        <div className="Animation">
          <h2>
            Animation&nbsp;
            <a target="_blank" rel="noreferrer"
              href={metadata?.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            >{metadata?.animation_url}</a>
          </h2>
          <video width="450" muted autoPlay loop controls controlsList="nodownload"
            src={metadata?.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
        </div>
      }

      {!loading &&
        <div className="Actions">
          <button
          // onClick={publish}
          >Publish</button>
        </div>
      }
    </div>
  )
}

export default Publish