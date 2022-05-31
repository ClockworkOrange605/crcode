import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../../../components/App/Auth/Auth'

import { list } from '../../../api/artworks'

import Loader from '../../../components/App/Loader/Loader'

import iconAdd from '../../../assets/icons/add.svg'
import iconImage from '../../../assets/icons/image.svg'

import './List.css'

function Drafts() {
  const { account } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const data = await list(account)
    setData(data)
    setLoading(false)
  }

  return (
    <div className="Drafts">
      {loading && <Loader />}

      {!loading && <h1>Choose NFT Draft</h1>}

      {!loading && data && data.map(item =>
        <Link to={`/account/artworks/${item._id}/editor/`} key={item._id} >
          <div className="Draft">
            <img src={iconImage} alt="" />
            <p>
              {item?.metadata?.name ||
                `${item._id.slice(0, 5)} . . . ${item._id.slice(-5)}`}
            </p>
          </div>
        </Link>
      )}

      {!loading && (
        <Link to='/account/artworks/create'>
          <div key={0} className="Draft">
            <img src={iconAdd} alt="" />
            <p>Create New NFT</p>
          </div>
        </Link>
      )}
    </div>
  )
}

export default Drafts