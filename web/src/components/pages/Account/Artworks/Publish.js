import { useEffect, useState, useRef, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router'

import { useMetaMask } from '../../../App/Auth/MetaMask'
import { get as getArtwork } from '../../../../api/artworks'
import { getMintTx, setMintTxHash } from '../../../../api/contract'

import Loader from '../../../App/Loader/Loader'

import * as monaco from 'monaco-editor'

import './styles/Publish.css'

function Publish() {
  const { ethereum } = useMetaMask()
  const navigate = useNavigate()

  const codeRef = useRef()

  const { id } = useParams()
  const [data, setData] = useState()
  const [metadata, setMetadata] = useState()
  const [code, setCode] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const data = await getArtwork(id)

      const response = await fetch(
        data.metadata_hash.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      const metadata = await response.json()

      //ISSUE: https://github.com/microsoft/monaco-editor/issues/3105
      const code = await monaco.editor.colorize(
        JSON.stringify(metadata, null, '\t'), 'json', { tabSize: 2 })

      setData(data)
      setMetadata(metadata)
      setCode(code)

      setLoading(false)
    }

    load()
  }, [id])

  // TODO: add chain validation
  async function publish() {
    const { tx } = await getMintTx(id)
    const txHash = await ethereum.request({ method: 'eth_sendTransaction', params: [tx] })

    setLoading("Processing Transaction")

    const { transaction, token } = await setMintTxHash(id, txHash)
    transaction?.status && navigate(`/collection/${token.id}`)
  }

  return (
    <Fragment>
      {loading && <Loader message={loading} />}

      {!loading && (
        <div className="Publisher">
          {/* <div className="Header"><h1>Review Metadata and Publish</h1></div> */}

          <div className="Metadata">
            <h2>
              Metadata&nbsp;
              <a target="_blank" rel="noreferrer"
                href={data?.metadata_hash.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              >{data?.metadata_hash}
              </a>
            </h2>
            <code ref={codeRef} dangerouslySetInnerHTML={{ __html: code }}></code>
          </div>

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

          <div className="Actions">
            <button onClick={publish}>Publish</button>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Publish