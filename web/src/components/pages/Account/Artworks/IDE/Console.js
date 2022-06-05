import { useRef, useEffect } from 'react'
import { Console as ConsoleFeed } from 'console-feed'

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

export default Console