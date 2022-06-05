import ReactDOM from 'react-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { create as createItem, rename as renameItem, remove as removeItem }
  from '../../../../../../api/editor'

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
      change(files)
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
      change(files)
      close()
    }

    ReactDOM.render(
      <Input value={item.name} cancel={close} submit={submit} />, container)
  }

  const remove = async (event, item) => {
    if (window.confirm(`Remove ${item.name}`)) {
      item.dir && delete item.files && delete item.size
      const { files } = await removeItem(id, { item })
      change(files)
    }
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
      <li className="disabled">Download</li>
      {item.dir && <li className="disabled">Upload</li>}
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
  }, [])

  return (
    <form ref={formRef} onSubmit={(e) => { submit(e, v) }}>
      <input ref={inputRef} defaultValue={value} onChange={e => setValue(e.target.value)} />
    </form>
  )
}

export default ActionsMenu