import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App routing', () => {
  it('shows the rooms page', () => {
    render(
      <MemoryRouter initialEntries={['/rooms']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Переговорные' }),
    ).toBeInTheDocument()
  })

  it('shows the not found page for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Ничего не найдено' }),
    ).toBeInTheDocument()
  })
})
