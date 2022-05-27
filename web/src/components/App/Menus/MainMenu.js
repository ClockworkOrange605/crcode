import { Link } from "react-router-dom"

const MainMenu = () => {
  return (
    <nav id="mainMenu" className="nav">
      <Link to="/collection">Collection</Link>
    </nav>
  )
}

export default MainMenu