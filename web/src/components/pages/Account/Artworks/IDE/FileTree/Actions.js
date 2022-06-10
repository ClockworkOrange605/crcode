import ReactDOM from 'react-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  upload as uploadItem,
  create as createItem,
  rename as renameItem,
  remove as removeItem
} from '../../../../../../api/editor'

const ActionsMenu = ({ item, change }) => {
  const { id } = useParams()

  const create = async (event, item, dir) => {
    const container = document.createElement("div")
    const node = event.target.closest(".item")

    container.classList.add('container')
    node.after(container)

    const close = () => container.remove()

    const submit = async (event, value) => {
      event.preventDefault()

      item.dir && delete item.files && delete item.size
      item.name === 'root' && (item.name = '')

      const { files } = await createItem(id, { dir, parent: item, name: value })
      files && change(files)
      close()
    }

    ReactDOM.render(
      <NewItem dir={dir} cancel={close} submit={submit} />, container)
  }

  const rename = (event, item) => {
    const container = document.createElement("div")
    const node = event.target.closest(".item")

    const button = node.querySelector(".options")
    const label = node.querySelector(".label")

    button.style.visibility = "hidden"
    label.style.visibility = "hidden"

    container.classList.add('container')
    label.after(container)

    const close = () => {
      button.style.visibility = "visible"
      label.style.visibility = "visible"
      container.remove()
    }

    const submit = async (event, value) => {
      event.preventDefault()
      item.dir && delete item.files && delete item.size
      const { files } = await renameItem(id, { item, name: value })
      files && change(files)
      close()
    }

    ReactDOM.render(
      <Input value={item.name} cancel={close} submit={submit} />, container)
  }

  const remove = async (event, item) => {
    if (window.confirm(`Remove ${item.name}`)) {
      item.dir && delete item.files && delete item.size
      const { files } = await removeItem(id, { item })
      files && change(files)
    }
  }

  const download = async (event, item) => {
    const baseUrl = `/preview/${id}/sources`

    if (item.dir) {
      const rootHandle = await window.showDirectoryPicker()
      downloadFolderHelper(rootHandle, item)
    }

    if (!item.dir) {
      const fileResponse = await fetch(`${baseUrl}${item.path}/${item.name}`)
      const fileSource = await fileResponse.blob()

      const obj = window.URL.createObjectURL(fileSource)
      const link = document.createElement('a')

      link.download = item.name
      link.style.display = 'none'
      link.href = obj

      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(obj)
    }
  }

  const upload = async (event, item) => {
    const handle = await window.showOpenFilePicker({ multiple: true })

    await handle.forEach(async (fileHandle) => {
      const file = await fileHandle.getFile()

      const query = new URLSearchParams({
        path: item.path, name: item.name === 'root' ? '' : item.name, filename: file.name
      })

      const { files } = await uploadItem(id, file, query.toString())
      files && change(files)
    })
  }

  const downloadFolderHelper = async (currentHandle, item) => {
    const baseUrl = `/preview/${id}/sources`

    const dirHandle = await currentHandle.getDirectoryHandle(item.name, { create: true })

    item.files.forEach(async (file) => {
      if (file.dir) downloadFolderHelper(dirHandle, file)
      else {
        const fileHandle = await dirHandle.getFileHandle(file.name, { create: true })
        const writable = await fileHandle.createWritable()

        const fileResponse = await fetch(`${baseUrl}${file.path}/${file.name}`)
        const fileSource = await fileResponse.blob()

        await writable.write(fileSource)
        await writable.close()
      }
    })
  }

  return (
    <menu className='actions'>
      {item.dir && (
        <Fragment>
          <li onClick={(e) => create(e, item, true)} >New Folder</li>
          <li onClick={(e) => create(e, item, false)}>New File</li>
          <hr />
        </Fragment>
      )}
      {item.name !== 'root' && (
        <Fragment>
          <li onClick={(e) => rename(e, item)}>Rename</li>
          <li onClick={(e) => remove(e, item)}>Remove</li>
          <hr />
        </Fragment>

      )}
      <li onClick={(e) => download(e, item)}>Download</li>
      {item.dir && <li onClick={(e) => upload(e, item)}>Upload Files</li>}
    </menu>
  )
}

const NewItem = ({ dir, cancel, submit }) => {
  return (
    <div className={`item ${dir ? 'folder' : 'file'}`}>
      <i className={`icon ${dir ? 'folder' : 'file'}`}></i>
      <Input cancel={cancel} submit={submit} />
    </div>
  )
}

const Input = ({ value, submit, cancel }) => {
  const formRef = useRef()
  const inputRef = useRef()

  const [v, setValue] = useState(value)

  //TODO: esc to focusout
  useEffect(() => {
    inputRef.current.addEventListener('focusout', cancel)
    inputRef.current.select()
  }, [cancel])

  return (
    <form ref={formRef} onSubmit={(e) => { submit(e, v) }}>
      <input ref={inputRef} defaultValue={value} onChange={e => setValue(e.target.value)} />
    </form>
  )
}

export default ActionsMenu