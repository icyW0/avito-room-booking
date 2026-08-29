import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bookingFixture } from '../../test/fixtures'
import { BookingsPage } from './BookingsPage'

const queryMocks = vi.hoisted(() => ({
  useMyBookingsQuery: vi.fn(),
  useOfficesQuery: vi.fn(),
}))

vi.mock('../../entities/booking/api/useMyBookingsQuery.ts', () => ({
  useMyBookingsQuery: queryMocks.useMyBookingsQuery,
}))

vi.mock('../../entities/office/api/useOfficesQuery.ts', () => ({
  useOfficesQuery: queryMocks.useOfficesQuery,
}))

vi.mock('./ui/CancelBookingDialog', () => ({
  CancelBookingDialog: () => null,
}))

const officesQuery = {
  data: { items: [bookingFixture.office] },
  isPending: false,
  isError: false,
  refetch: vi.fn(),
}

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingsPage />
    </MemoryRouter>,
  )
}

describe('BookingsPage', () => {
  beforeEach(() => {
    queryMocks.useOfficesQuery.mockReturnValue(officesQuery)
    queryMocks.useMyBookingsQuery.mockReturnValue({
      data: { items: [bookingFixture] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })
  })

  it('shows the loading skeleton', () => {
    queryMocks.useMyBookingsQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      refetch: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByLabelText('Загрузка бронирований'),
    ).toBeInTheDocument()
  })

  it('shows the loading error', () => {
    queryMocks.useMyBookingsQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Не удалось загрузить данные' }),
    ).toBeInTheDocument()
  })

  it('shows the empty state', () => {
    queryMocks.useMyBookingsQuery.mockReturnValue({
      data: { items: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Нет бронирований' }),
    ).toBeInTheDocument()
  })

  it('shows bookings returned by the API', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: bookingFixture.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Отменить' }),
    ).toBeInTheDocument()
  })

  it('requests past bookings after switching tabs', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('tab', { name: 'Прошедшие' }))

    expect(queryMocks.useMyBookingsQuery).toHaveBeenLastCalledWith({
      scope: 'past',
    })
    expect(
      screen.queryByRole('button', { name: 'Отменить' }),
    ).not.toBeInTheDocument()
  })

  it('requests bookings for the selected office', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Офис Москва' }))

    expect(queryMocks.useMyBookingsQuery).toHaveBeenLastCalledWith({
      scope: 'upcoming',
      officeId: 'office-moscow',
    })
  })

  it('filters bookings by the selected period', async () => {
    const user = userEvent.setup()
    queryMocks.useMyBookingsQuery.mockReturnValue({
      data: {
        items: [
          bookingFixture,
          {
            ...bookingFixture,
            id: 'booking-future',
            title: 'Встреча через два месяца',
            startsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })

    renderPage()

    await user.click(screen.getByRole('button', { name: 'За всё время' }))
    await user.click(screen.getByRole('menuitem', { name: 'За 30 дней' }))

    expect(
      screen.queryByRole('heading', { name: 'Встреча через два месяца' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'За 30 дней' }),
    ).toBeInTheDocument()
  })
})
