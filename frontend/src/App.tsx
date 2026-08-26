import { Navigate, Route, Routes } from 'react-router-dom'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { RoomsPage } from './pages/rooms/RoomsPage.tsx'
import { AppLayout } from './app/layout/AppLayout.tsx'
import NotFoundPage from './pages/not-found/NotFoundPage.tsx'
import { RoomDetailsPage } from './pages/room-details/RoomDetailsPage.tsx'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/rooms" element={<RoomsPage />} />

        <Route
          path="/rooms/:roomId"
          element={<RoomDetailsPage />}
        />

        <Route
          path="/bookings"
          element={<PlaceholderPage title="Мои бронирования" />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
