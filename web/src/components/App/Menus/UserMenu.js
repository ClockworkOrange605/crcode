import { Link } from "react-router-dom"

const UserMenu = () => {
  return (
    <nav id="accountMenu" className="nav">
      <Link to="/account/artworks/create">Create Artwork</Link>
      <Link to="/account/artworks">My Artworks</Link>
      <hr style={{ border: '1px dashed #aaaaaa' }} />
      <Link to="/account/collection">My Collection</Link>
    </nav>
  )
}

export default UserMenu