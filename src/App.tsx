import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import YokaiDetailPage from './pages/YokaiDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/yokai/:id" element={<YokaiDetailPage />} />
    </Routes>
  )
}
