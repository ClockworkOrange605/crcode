import { useRef, useState, useEffect } from 'react'
import { save as saveFile } from '../../../../../api/editor'
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
        language: 'typescript'
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
            // const language =
            // res.headers.get('Content-type').split(';')[0].split('/')[1]
            // monaco.editor.setModelLanguage(editor.getModel(), language)
          })
      }
    }
  }, [id, file, editor])

  const ctrlSEventListener = async (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      await save()
    }
  }

  async function save() {
    const content = editor.getValue()
    const query = new URLSearchParams({ file: file })

    await saveFile(id, content, query.toString())
  }

  return (
    <div ref={editorRef} className="EditorInstance" onKeyDown={ctrlSEventListener} />
  )
}

export default Editor