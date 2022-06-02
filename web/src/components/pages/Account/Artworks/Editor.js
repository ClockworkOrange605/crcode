import { useRef, useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Console as ConsoleFeed, Hook, Decode } from 'console-feed'

import { get as getArtwork, generate as generateArtwork } from '../../../../api/artworks'
import { get as getTemplate } from '../../../../api/templates'
import { getFiles } from '../../../../api/editor'

import Loader from '../../../App/Loader/Loader'

import './styles/Editor.css'

import * as monaco from 'monaco-editor'

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
            <div className="fileTree">
              <FileList data={files} index={0} />
            </div>

            <Editor id={id} file={template?.sources?.main} />
          </div>

          <div className="Preview">
            <Window url={`/preview/${id}/sources/${template?.sources?.index}`}
              logs={setLogs}
            />

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

function Console({ logs }) {
  const consoleRef = useRef()

  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  return (
    <div className="Console" ref={consoleRef}>
      <ConsoleFeed variant="dark" logs={logs} />
    </div>
  )
}

function Window({ url, logs }) {
  const iframeRef = useRef()

  function start() {
    iframeRef.current.src = `${'http://localhost:9005'}${url}`
    logs([])
  }

  function stop() {
    iframeRef.current.src = ''
    logs([])
  }

  function captureLogs() {
    Hook(iframeRef.current.contentWindow.console,
      log => logs(logs => [...logs, Decode(log)])
    )
  }

  return (
    <Fragment>
      <div className="Controls">
        <div style={{ float: "left" }}>
          {/* <button onClick={() => saveMethod()}>▶ Run</button> */}
          <button onClick={() => start()}>▶ Run</button>
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