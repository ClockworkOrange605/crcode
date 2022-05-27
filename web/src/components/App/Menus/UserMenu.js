import { Link } from "react-router-dom"

const UserMenu = () => {
  return (
    <nav id="accountMenu" className="nav">
      <Link to="/account/nft/create">Create NFT</Link>
      <Link to="/account/nft/list">NFT`s Drafts</Link>
      <hr style={{ border: '1px dashed #aaaaaa' }} />
      <Link to="/account/tokens">My Collection</Link>
    </nav>
  )
}

export default UserMenu