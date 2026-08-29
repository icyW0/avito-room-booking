import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { roomFixture } from '../../../test/fixtures'
import { RoomCard } from './RoomCard'

function RoomDestination() {
  const location = useLocation()

  return (
    <div>
      <span>Страница комнаты</span>
      <span>{JSON.stringify(location.state)}</span>
    </div>
  )
}

describe('RoomCard', () => {
  it('opens the room page with a command to show the booking form', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/rooms']}>
        <Routes>
          <Route
            path="/rooms"
            element={<RoomCard room={{ ...roomFixture, available: true }} />}
          />
          <Route path="/rooms/:roomId" element={<RoomDestination />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'Забронировать' }))

    expect(screen.getByText('Страница комнаты')).toBeInTheDocument()
    expect(screen.getByText('{"openBookingModal":true}')).toBeInTheDocument()
  })

  it('does not allow booking an unavailable room', () => {
    render(
      <MemoryRouter>
        <RoomCard room={{ ...roomFixture, available: false }} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Забронировать' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })
})
