import { Fragment, useRef } from 'react'

import ActionsMenu from './Actions'

function FileTree({ data, change }) {
  const rootRef = useRef()

  return (
    <div className="fileTree closed" ref={rootRef}>
      <FileList root={rootRef} data={data} change={change} index={0} />
    </div>
  )
}

function FileList({ root, data, depth, change }) {

  //TODO: redesign with :hover
  const toggleMenu = () => {
    root.current.classList.toggle('opened')
    root.current.classList.toggle('closed')
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
            className={`item ${item.dir ? 'folder' : 'file'}`}
          // ${item.name === file ? 'selected' : ''}
          // onClick={() => setFile(item.name)}
          >
            <i className={`icon ${item.dir ? 'folder' : 'file'}`}></i>
            <div className='label'>{item.name}</div>
            <i className="icon options">
              <ActionsMenu item={item} change={change}></ActionsMenu>
            </i>
          </div>

          {item.dir && (
            <div
              key={`dir${item.path}${item.name}`}
              className={`collapsable depth-${index}`}>
              <FileList root={root} data={item.files} change={change} depth={index} />
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
            ></ActionsMenu>
          </i>
        </div>
      )}
    </Fragment>
  )
}

export default FileTree