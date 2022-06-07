import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { list } from '../../../../api/artworks'
import Loader from '../../../App/Loader/Loader'
import iconAdd from '../../../../assets/icons/add.svg'
import iconImage from '../../../../assets/icons/image.svg'

import './styles/List.css'

function Drafts() {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const data = await list()
    setArtworks(data)
    setLoading(false)
  }

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Drafts">
          <h1>Choose NFT Draft</h1>

          <ArtworksList data={artworks} />

          <Link to='/account/artworks/create'>
            <div key={0} className="Draft">
              <picture>
                <img src={iconAdd} alt="" />
              </picture>
              <p>Create New NFT</p>
            </div>
          </Link>
        </div>
      )}
    </Fragment>
  )
}

const ArtworksList = ({ data }) => {

  const getLink = (item) => {
    switch (item?.status) {
      case 'draft':
        return `/account/artworks/${item._id}/editor/`
      case 'finished':
        return `/account/artworks/${item._id}/metadata`
      case 'ready':
        return `/account/artworks/${item._id}/publish`
      case 'minted':
        return `/collection/${item.token_id}/`
      default:
        return `/account/artworks/${item._id}/editor/`
    }
  }

  return (
    <Fragment>
      {data && data.map(item =>
        <Link to={getLink(item)} key={item._id} >
          <div className="Draft">
            <picture>
              <source srcSet={item?.image} />
              <img src={iconImage} alt="" />
            </picture>
            <p>
              {item?.metadata?.name ||
                `${item._id.slice(0, 5)} . . . ${item._id.slice(-5)}`}
            </p>
          </div>
        </Link>
      )}
    </Fragment >
  )
}

export default Drafts