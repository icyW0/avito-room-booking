import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppHeader } from './AppHeader'

function CurrentPath() {
  const location = useLocation()

  return <div data-testid="current-path">{location.pathname}</div>
}

describe('AppHeader', () => {
  it('navigates to the rooms page when the logo is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/bookings']}>
        <AppHeader />
        <CurrentPath />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'На главную' }))

    expect(screen.getByTestId('current-path')).toHaveTextContent('/rooms')
  })
})
