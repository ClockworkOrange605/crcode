import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { list, copy } from "../../../../api/templates"

import Loader from '../../../App/Loader/Loader'
import './styles/Create.css'

const CreatePage = () => {
  const navigate = useNavigate()

  const [templates, setTemplates] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const templatesList = await list()
    setTemplates(templatesList)
    setLoading(false)
  }

  const selectTemplate = async (template) => {
    const { id } = await copy(template.slug, template.sources.version)
    navigate(`/account/artworks/${id}/editor`)
  }

  return (
    <Fragment>
      {loading && <Loader />}

      {!loading && (
        <div className="Templates">
          <h1>Choose Template</h1>

          <Templates data={templates} submit={selectTemplate} />

          <div className="Template disabled">
            <div className="Logo"></div>
            <p>Coming Soon ...</p>
          </div>
        </div>
      )}
    </Fragment>
  )
}

const Templates = ({ data, submit }) => {
  return (
    <Fragment>
      {data && data.map(item =>
        <div className="Template" key={item.slug} onClick={() => submit(item)}>
          <div className="Logo">
            <img src={item.library.logo} alt={`${item.library.name} Logo`} />
          </div>
          <p>{item.library.name}</p>
        </div>
      )}
    </Fragment>
  )
}

export default CreatePage