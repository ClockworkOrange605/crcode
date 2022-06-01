import { useRef, useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Console, Hook, Decode } from 'console-feed'

import { get as getArtwork, generate as generateArtwork } from '../../../api/artworks'
import { get as getTemplate } from '../../../api/templates'
import { getFiles } from '../../../api/editor'

import Loader from '../../../components/App/Loader/Loader'

import './Editor.css'

import * as monaco from 'monaco-editor'

function IDE() {
  const navigate = useNavigate()

  const iframeRef = useRef()
  const consoleRef = useRef()

  const { id } = useParams()

  const [loadingMessage, setLoading] = useState(null)

  // const [artwork, setArtwork] = useState({})
  const [template, setTemplate] = useState()
  const [files, setFiles] = useState([])

  const [logs, setLogs] = useState([])

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

  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  function reload() {
    const host = 'http://localhost:9005' //TODO: make better config
    iframeRef.current.src = `${host}/preview/${id}/sources/${template?.sources?.index}`
    setLogs([])
  }

  function stop() {
    iframeRef.current.src = ''
    setLogs([])
  }

  function captureLogs() {
    Hook(iframeRef.current.contentWindow.console,
      log => setLogs(logs => [...logs, Decode(log)])
    )
  }

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
            <div className="fileTree">
              <FileList data={files} index={0} />
            </div>

            <Editor id={id} file={template?.sources?.main} />
          </div>

          <div className="Preview">
            <div className="Controls">
              <div style={{ float: "left" }}>
                {/* <button onClick={() => saveMethod()}>▶ Run</button> */}
                <button onClick={() => reload()}>▶ Run</button>
                <button onClick={() => stop()}>◼ Stop</button>
              </div>

              {/* <label htmlFor="AutoReload" style={{ float: "right", color: "#aaa", cursor: "not-allowed" }}>
                <input id="AutoReload" type="checkbox" disabled></input>
                Auto Reload
              </label> */}
            </div>

            <iframe className="Window" ref={iframeRef} title="Preview"
              // TODO: try to capture logs earlier
              onLoad={captureLogs}
            />

            <div className="Console" ref={consoleRef}>
              <Console variant="dark" logs={logs} />
            </div>
          </div>

          <div className="Actions">
            <button href="#" onClick={generateMedia}>Save</button>
          </div>

        </div>
      )}
    </Fragment>
  )
}

//TODO: refactor and redesign
function FileList({ data, depth }) {
  return (
    <Fragment>
      {data &&
        data.map((item, index) => (
          item.dir ? (
            <span key={`${depth}-${index}`}>
              <FileList data={item.files} depth={index} />
            </span>
          ) : (
            <p
              key={`${depth}-${index}`}
            // className={item.name === file ? 'selected' : ''}
            // onClick={() => setFile(item.name)}
            >{item.name}</p>
          )
        ))
      }
    </Fragment>
  )
}

function Editor({ id, file }) {
  const editorRef = useRef()

  const [editor, setEditor] = useState(null)

  useEffect(() => {
    // temp in dev enviroment
    if (!editor) {
      const editorInstance = monaco.editor.create(editorRef.current, {
        theme: 'vs-dark',
        minimap: { enabled: false },
        tabSize: 2,
        scrollBeyondLastLine: false,
      })

      setEditor(editorInstance)
    }
  }, [editor])

  useEffect(() => {
    if (editor && file) {
      const filepath = `/preview/${id}/sources/${file}`

      if (editor) {
        fetch(filepath)
          .then(async (res) => {
            const source = await res.text()
            editor.setValue(source)

            // const language = res.headers.get('Content-type').split(';')[0].split('/')[1]
            // monaco.editor.setModelLanguage(editor.getModel(), language)
          })
      }
    }
  }, [id, file, editor])

  // function save() {
  //   const content = editor.getValue()
  //   console.log(fileName, content)
  //   fetch(`/${account}/nft/${draftId}/files/${fileName}/save`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'text/plain',
  //       'x-auth-token': sessionStorage.getItem(account)
  //     },
  //     body: content
  //   }).then(async (res) => {
  //     await res.json()
  //     reloadFrame()
  //   })
  // }

  return (
    <div ref={editorRef} className="EditorInstance" />
  )
}

export default IDE