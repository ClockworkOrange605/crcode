import { Fragment, useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from '../../App/Auth/Auth'

import { list, copy } from "../../../api/templates"

import './Create.css'

const CreatePage = () => {
  const navigate = useNavigate()
  const { account } = useAuth()

  const selectTemplate = async (template) => {
    const { id } = await copy(account, template.slug, template.sources.version)
    navigate(`/account/artworks/${id}/editor`)
  }

  return (
    <div className="Templates">
      <h1>Choose Template</h1>

      <Templates submit={selectTemplate} />

      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming Soon ...</p>
      </div>
    </div>
  )
}

const Templates = ({ submit }) => {
  const [templates, setTemplates] = useState()

  useEffect(() => { load() }, [])

  const load = async () => {
    const templatesList = await list()
    setTemplates(templatesList)
  }

  return (
    <Fragment>
      {templates && templates.map(item =>
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