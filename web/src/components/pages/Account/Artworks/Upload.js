import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../../../App/Loader/Loader"
import { get as getArtwork } from '../../../../api/artworks'
import { get as getTemplate } from '../../../../api/templates'
import { getFiles } from "../../../../api/editor"

import './styles/Upload.css'

import * as monaco from 'monaco-editor'

function Upload() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loadingMessage, setLoading] = useState(' ')

  // const [artwork, setArtwork] = useState()
  const [template, setTemplate] = useState()
  const [files, setFiles] = useState([])
  // const [openedFile, setOpenedFile] = useState()
  const [code, setCode] = useState()

  const codeRef = useRef()

  useEffect(() => {
    const load = async () => {
      const artwork = await getArtwork(id)
      const template = await getTemplate(artwork.template)
      const { files } = await getFiles(id)

      // setArtwork(artwork)
      setTemplate(template)
      setFiles(files)

      await openFile(template.sources.main)
      setLoading(null)
    }

    load()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const openFile = async (file) => {
    const filepath = `/preview/${id}/sources/${file}`

    const response = await fetch(filepath)

    //TODO: write RegExp
    const language = response.headers.get("Content-Type").split(';')[0].split('/')[1].trim()
    const content = await response.text()

    const code = await monaco.editor.colorize(
      content, language, {theme: 'vs-dark', tabSize: 2 })

    setCode(code)

    // setOpenedFile(file)
  }

  const upload = async () => {
    setLoading('Uploading Sources to Filecoin')

    navigate(`/account/artworks/${id}/publish`)
  }

  return (
    <>
      {loadingMessage && <Loader message={loadingMessage} />}
      {!loadingMessage && (
        <div className="Uploader">
          <div>

          <div className="Files">
            {/* TODO: fix layout */}
            <h2>Code</h2>
            <br/>
            {/* TODO: make recursive */}
            <div className="Tree">
              {files.map(item => (
                <div className="file" onClick={() => {openFile(item.name)}} key={item.name}>{ item.name }</div>
              ))}
            </div>
            <div>
              <code ref={codeRef} dangerouslySetInnerHTML={{ __html: code }}></code>
            </div>
          </div>

          <div className="Preview">
            <h2>Preview</h2>
            <iframe src={`/preview/${id}/sources/${template?.sources?.index}`} title="Preview"/>
          </div>
          </div>

          <div className="Actions">
            <button href="#" onClick={upload}>Upload</button>
          </div>
        </div>
      )}
    </>
  )
}

export default Upload