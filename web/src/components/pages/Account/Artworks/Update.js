import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
// import { Link } from 'react-router-dom'

import Loader from '../../../App/Loader/Loader'

import { get as getArtwork, metadata as uploadMetadata } from '../../../../api/artworks'
import { getFiles } from '../../../../api/editor'

import { sizeConverter } from '../../../../utils/helpers'

import './styles/Update.css'

function Update() {
  const navigate = useNavigate()

  const { id } = useParams()

  const [artwork, setArtwork] = useState()
  const [size, setSize] = useState()

  const [selectedImage, selectImage] = useState(`preview_5.png`)

  const [loadingMessage, setLoading] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading("  ")

      const data = await getArtwork(id)
      const { size } = await getFiles(id)

      setArtwork(data)
      setSize(sizeConverter(size))

      setLoading()
    }

    load()
  }, [id])

  function openPopup(event) {
    event.preventDefault()
    document.querySelector('.Popup').style.visibility = 'visible'
  }

  function closePopup(event) {
    event.preventDefault()
    document.querySelector('.Popup').style.visibility = 'hidden'
  }

  // TODO: refactor
  async function submit(event) {
    event.preventDefault()

    const form = new FormData(document.querySelector('form'))
    const metadata = {
      name: form.get('name'),
      description: form.get('description'),
      image: form.get('image'),
      animation: form.get('animation'),
      //TODO: add background color selector?
      // background_color:
      //TODO: add external url
      // external_url:
      //TODO: brainstorm attributes
      attributes: [
        {
          trait_type: "Library",
          value: artwork?.template
        },
        {
          trait_type: "Version",
          value: artwork?.version
        },
        {
          trait_type: "Size",
          value: size
        },
      ]
    }

    setLoading("Uploading Metadata to IPFS")

    await uploadMetadata(id, { metadata })

    navigate(`/account/artworks/${id}/publish`)
  }

  return (
    <Fragment>
      {loadingMessage && <Loader message={loadingMessage} />}

      {!loadingMessage && (
        <form id="MinterForm" onSubmit={submit} >
          <div className="Minter">
            {/* <div className="Header">
              <h1>Token Metadata</h1>
              <Link to={`/account/artworks/${id}/editor`}>⬅ Go Back</Link>
            </div> */}

            <div className="Metadata">
              <label htmlFor="name">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Token Name"
                  defaultValue={artwork?.metadata?.name}
                />
              </label>

              <label htmlFor="description">
                <span>Description</span>
                <textarea
                  name="description"
                  required
                  placeholder="Token Description"
                  defaultValue={artwork?.metadata?.description}
                />
              </label>

              <label>
                <span>Attributes</span>
                <p>Library: {artwork?.template}</p>
                <p>Version: {artwork?.version}</p>
                <p>Size: {size}</p>
              </label>
            </div>

            <div className="Media">
              <label>
                <span>
                  Image
                  <button style={{ float: 'right' }}
                    onClick={openPopup}
                  >🎨 Change</button>
                </span>
                <img width="450" alt="" src={`/preview/${id}/media/${selectedImage}`} />
                <input name="image" type="hidden" defaultValue={selectedImage} />
              </label>

              <label>
                <span>Animation</span>
                <video width="450" muted autoPlay loop controls controlsList="nodownload" src={`/preview/${id}/media/demo.mp4`} />
                <input name="animation" type="hidden" defaultValue={`demo.mp4`} />
              </label>
            </div>

            <div className="Actions">
              <button type="submit">Save</button>
            </div>

            <div className="Popup">
              <h1>Select Image</h1>
              <span onClick={closePopup} className="CloseButton">❌</span>
              <div className="Images">
                {new Array(9).fill("", 0, 9).map((p, i) =>
                  <picture key={i}
                    className={Boolean(
                      `/preview/${id}/media/${selectedImage}` ===
                      `/preview/${id}/media/preview_${i + 1}.png`
                    ) ? 'selected' : ''}
                    onClick={() => { selectImage(`preview_${i + 1}.png`) }}
                  >
                    <img width="250" alt={p} src={`/preview/${id}/media/preview_${i + 1}.png`} />
                  </picture>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </Fragment>
  )
}

export default Update