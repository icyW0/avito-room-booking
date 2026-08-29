import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../shared/api/ApiError'
import { bookingFixture } from '../../../test/fixtures'
import { CancelBookingDialog } from './CancelBookingDialog'

const mutationMocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  state: {
    isPending: false,
    isError: false,
    error: null as unknown,
  },
}))

vi.mock('../../../entities/booking/api/useCancelBookingMutation', () => ({
  useCancelBookingMutation: () => ({
    mutate: mutationMocks.mutate,
    reset: mutationMocks.reset,
    ...mutationMocks.state,
  }),
}))

describe('CancelBookingDialog', () => {
  beforeEach(() => {
    mutationMocks.mutate.mockReset()
    mutationMocks.reset.mockReset()
    mutationMocks.state.isPending = false
    mutationMocks.state.isError = false
    mutationMocks.state.error = null
  })

  it('shows the selected booking information', () => {
    render(
      <CancelBookingDialog
        booking={bookingFixture}
        onClose={() => undefined}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Отменить бронирование?' }),
    ).toBeInTheDocument()
    expect(screen.getByText(bookingFixture.title)).toBeInTheDocument()
    expect(screen.getByText('Комната «Эверест», 4 этаж')).toBeInTheDocument()
    expect(screen.getByText(/24 октября, 15:00–16:00/i)).toBeInTheDocument()
  })

  it('closes without cancelling when the user keeps the booking', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<CancelBookingDialog booking={bookingFixture} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Нет, оставить' }))

    expect(mutationMocks.mutate).not.toHaveBeenCalled()
    expect(mutationMocks.reset).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('cancels the selected booking and closes after success', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    mutationMocks.mutate.mockImplementationOnce((_booking, options) => {
      options.onSuccess()
    })

    render(<CancelBookingDialog booking={bookingFixture} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Да, отменить' }))

    expect(mutationMocks.mutate).toHaveBeenCalledWith(
      bookingFixture,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows the backend cancellation error', () => {
    mutationMocks.state.isError = true
    mutationMocks.state.error = new ApiError(
      400,
      'BOOKING_NOT_CANCELLABLE',
      'Можно отменять только будущие бронирования',
    )

    render(
      <CancelBookingDialog
        booking={bookingFixture}
        onClose={() => undefined}
      />,
    )

    expect(
      screen.getByText('Можно отменять только будущие бронирования'),
    ).toBeInTheDocument()
  })
})
