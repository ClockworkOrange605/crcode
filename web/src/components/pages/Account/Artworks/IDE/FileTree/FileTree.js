import { Fragment, useRef } from 'react'
import { useParams } from 'react-router-dom'

import ActionsMenu from './Actions'

function FileTree({ data, change, open }) {
  const rootRef = useRef()

  return (
    <div className="fileTree closed" ref={rootRef}>
      <FileList root={rootRef} data={data} change={change} open={open} index={0} />
    </div>
  )
}

function FileList({ root, data, depth, change, open }) {
  const { id } = useParams()

  //TODO: redesign with :hover
  const toggleMenu = () => {
    root.current.classList.toggle('opened')
    root.current.classList.toggle('closed')
  }

  const openItem = (event, item) => {
    if (!item.dir) {
      const url = `/preview/${id}/sources${item.path}/${item.name}`

      console.log(url, item)

      open(`${item.path}/${item.name}`)
      toggleMenu()
    }
  }

  return (
    <Fragment>
      {depth === undefined && (
        <div className='item root disabled' key="dir">
          <i className="icon"></i>
          <div className='label'>source_code/</div>
          <i className="icon collapse" onClick={toggleMenu}></i>
        </div>
      )}

      {data && data.map((item, index) => (
        <Fragment>
          <div key={`${item.path}${item.name}`}
            className={`item ${item.dir ? 'folder disabled' : 'file'}`}
          >
            <i className={`icon ${item.dir ? 'folder' : 'file'}`}></i>

            <div className='label'
              onClick={e => openItem(e, item)}>{item.name}</div>

            <i className="icon options">
              <ActionsMenu item={item} change={change}></ActionsMenu>
            </i>
          </div>

          {item.dir && (
            <div
              key={`dir${item.path}${item.name}`}
              className={`collapsable depth - ${index}`}>
              <FileList root={root} data={item.files} depth={index} change={change} open={open} />
            </div>
          )}
        </Fragment>
      ))
      }

      {depth === undefined && (
        <div className='item disabled' key="dirroot">
          <i className="icon"></i>
          <div className='label'>[root]</div>
          <i className="icon options">
            <ActionsMenu
              item={{ name: 'root', path: '/', dir: true, files: data }}
              change={change}
            ></ActionsMenu>
          </i>
        </div>
      )}
    </Fragment>
  )
}

export default FileTree