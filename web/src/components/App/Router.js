import { Routes, Route } from "react-router-dom"

const Router = () => {
  return (
    <Routes>
      <Route path="*"
        element={<p>Not Found - 404 Page</p>}
      />
    </Routes>
  )
}

export default Router