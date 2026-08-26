import { Navigate, Route, Routes } from 'react-router-dom'
import { PlaceholderPage } from './pages/PlaceholderPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />
      <Route path="/rooms" element={<PlaceholderPage title="Переговорные" />} />
      <Route
        path="/rooms/:roomId"
        element={<PlaceholderPage title="Расписание комнаты" />}
      />
      <Route
        path="/bookings"
        element={<PlaceholderPage title="Мои бронирования" />}
      />
      <Route path="*" element={<PlaceholderPage title="Ничего не найдено" />} />
    </Routes>
  )
}
