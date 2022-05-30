import { useRef, useState, useEffect, Fragment } from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import { Console, Hook, Decode } from 'console-feed'

import { useAuth } from '../../../components/App/Auth/Auth'

import { get as getArtwork } from '../../../api/artworks'
import { get as getTemplate } from '../../../api/templates'
import { getFiles } from '../../../api/editor'

// import Loader from '../Common/Loader'

import * as monaco from 'monaco-editor'

import './Editor.css'

function IDE() {
  // const navigate = useNavigate()

  const iframeRef = useRef()
  const consoleRef = useRef()

  const { id } = useParams()
  const { account } = useAuth()

  const [artwork, setArtwork] = useState({})
  const [template, setTemplate] = useState()
  const [files, setFiles] = useState([])

  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(false)
  // const [saveMethod, setSaveMethod] = useState()

  useEffect(() => {
    if (account && id)
      load(id, account)
  }, [account, id])

  const load = async (id, account) => {
    const artwork = await getArtwork(id, account)
    const template = await getTemplate(artwork.template)
    const { files } = await getFiles(id, account)

    setArtwork(artwork)
    setTemplate(template)
    setFiles(files)
  }

  function reload() {
    // const host = 'http://localhost:9005'
    const host = ''
    iframeRef.current.src = `${host}/preview/${id}/sources/${template?.sources?.index}`
    setLogs([])
  }

  function stop() {
    iframeRef.current.src = ''
    setLogs([])
  }

  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  function captureLogs() {
    Hook(iframeRef.current.contentWindow.console,
      log => setLogs(logs => [...logs, Decode(log)])
    )
  }

  // function generateMedia() {
  //   setLoading(true)
  //   fetch(`/${account}/nft/${id}/media`, {
  //     method: 'POST',
  //     headers: {
  //       'x-auth-token': sessionStorage.getItem(account)
  //     }
  //   }).then(res => {
  //     navigate.push(`/account/nft/${id}/mint`)
  //     setLoading(false)
  //   })
  // }

  return (
    <div className="IDE">
      {/* {loading && <Loader message="Generating Media Files" />} */}

      {/* {!loading && (
        <div className="Header"></div>
      )} */}

      {!loading && (
        <div className="Workspace">
          {/* //TODO: refactor and redesign files */}
          <div className="fileTree">
            <FileList data={files} index={0} />
          </div>

          <Editor
            draftId={id}
            file={template?.sources?.main}
          // setSaveMethod={setSaveMethod}
          // reloadFrame={reload}
          />
        </div>
      )}

      {!loading && (
        <div className="Preview">
          <div className="Controls">
            <div style={{ float: "left" }}>
              {/* <button onClick={() => saveMethod()}>▶ Run</button> */}
              <button onClick={() => reload()}>▶ Run</button>
              <button onClick={() => stop()}>◼ Stop</button>
            </div>

            <label htmlFor="AutoReload" style={{ float: "right", color: "#aaa", cursor: "not-allowed" }}>
              <input id="AutoReload" type="checkbox" disabled></input>
              Auto Reload
            </label>
          </div>

          <iframe
            title="Preview"
            className="Window"
            ref={iframeRef}
            // TODO: try to capture logs earlier
            onLoad={captureLogs}
          />

          <div className="Console" ref={consoleRef}>
            <Console
              variant="dark"
              logs={logs}
            />
          </div>
        </div>
      )}

      {/* {!loading && (
        <div className="Actions">
          <button href="#" onClick={generateMedia}>Save</button>
        </div>
      )} */}
    </div>
  )
}

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
    </Fragment >
  )
}

function Editor({ draftId, file, setSaveMethod, reloadFrame }) {
  // const { account } = useAuth()

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
  }, [])

  useEffect(() => {
    if (editor && file) {
      const filepath = `/preview/${draftId}/sources/${file}`

      if (editor) {
        fetch(filepath)
          .then(async (res) => {
            const source = await res.text()
            const language = res.headers.get('Content-type').split(';')[0].split('/')[1]

            editor.setValue(source)
            monaco.editor.setModelLanguage(editor.getModel(), language)
          })

        // setSaveMethod(() => save)
      }
    }
  }, [editor, file])

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