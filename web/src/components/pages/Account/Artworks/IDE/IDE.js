import { useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { get as getArtwork, generate as generateArtwork }
  from '../../../../../api/artworks'
import { get as getTemplate } from '../../../../../api/templates'
import { getFiles } from '../../../../../api/editor'

import Loader from '../../../../App/Loader/Loader'
import Console from './Console'
import Window from './Window'
import FileTree from './FileTree/FileTree'
import Editor from './Editor'

import '../styles/Editor.css'

function IDE() {
  const navigate = useNavigate()

  const { id } = useParams()
  // const [artwork, setArtwork] = useState({})
  const [template, setTemplate] = useState()
  const [files, setFiles] = useState([])

  const [logs, setLogs] = useState([])
  const [loadingMessage, setLoading] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading('Initializing Editor')

      const artwork = await getArtwork(id)
      const template = await getTemplate(artwork.template)
      const { files } = await getFiles(id)

      // setArtwork(artwork)
      setTemplate(template)
      setFiles(files)

      setLoading(null)
    }

    load()
  }, [id])

  async function generateMedia() {
    setLoading('Generating Media Files')

    await generateArtwork(id)
    navigate(`/account/artworks/${id}/metadata`)

    setLoading(null)
  }

  return (
    <Fragment>
      {loadingMessage && <Loader message={loadingMessage} />}

      {!loadingMessage && (
        <div className="IDE">
          <div className="Workspace">
            {/* TODO: check better way to pass setFiles */}
            <FileTree data={files} change={setFiles} />
            <Editor id={id}
              file={template?.sources?.main} />
          </div>

          <div className="Preview">
            <Window logs={setLogs}
              url={`/preview/${id}/sources/${template?.sources?.index}`} />
            <Console logs={logs} />
          </div>

          <div className="Actions">
            <button href="#" onClick={generateMedia}>Save</button>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default IDE