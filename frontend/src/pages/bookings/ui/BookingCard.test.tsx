import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { bookingFixture } from '../../../test/fixtures'
import { BookingCard } from './BookingCard'

describe('BookingCard', () => {
  it('shows booking information in the office timezone', () => {
    render(
      <BookingCard
        booking={bookingFixture}
        canCancel
        onCancel={() => undefined}
      />,
    )

    expect(
      screen.getByRole('heading', { name: bookingFixture.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Эверест')).toBeInTheDocument()
    expect(screen.getByText('4 этаж')).toBeInTheDocument()
    expect(screen.getByText('15:00–16:00 MSK')).toBeInTheDocument()
    expect(screen.getByText('ОКТЯБРЬ')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
  })

  it('passes the booking to the cancel handler', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <BookingCard
        booking={bookingFixture}
        canCancel
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Отменить' }))

    expect(onCancel).toHaveBeenCalledWith(bookingFixture)
  })

  it('does not allow cancelling a past booking', () => {
    render(
      <BookingCard
        booking={bookingFixture}
        canCancel={false}
        onCancel={() => undefined}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Отменить' }),
    ).not.toBeInTheDocument()
  })
})
