import { useRef, useState, useEffect } from 'react'

import * as monaco from 'monaco-editor'

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
        rulers: [60, 90, 120],
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

export default Editor