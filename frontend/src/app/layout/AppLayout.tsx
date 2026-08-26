import { Outlet } from 'react-router-dom'
import { RealtimeStatusBanner } from '../../shared/realtime/RealtimeStatusBanner'
import { AppHeader } from './AppHeader'

export function AppLayout() {
  return (
    <>
      <RealtimeStatusBanner />
      <AppHeader />
      <Outlet />
    </>
  )
}
