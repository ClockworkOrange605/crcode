import { Fragment, useRef } from 'react'
import { Hook, Decode } from 'console-feed'

function Window({ url, logs }) {
  const iframeRef = useRef()

  function start() {
    iframeRef.current.src = url
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

export default Window