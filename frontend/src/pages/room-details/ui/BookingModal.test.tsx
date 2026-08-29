import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../shared/api/ApiError'
import { bookingFixture, roomFixture } from '../../../test/fixtures'
import { BookingModal } from './BookingModal'

const mutationMocks = vi.hoisted(() => ({
  mutate: vi.fn(),
}))

vi.mock('../../../entities/booking/api/useCreateBookingMutation', () => ({
  useCreateBookingMutation: () => ({
    mutate: mutationMocks.mutate,
    isPending: false,
    isError: false,
    error: null,
  }),
}))

function renderModal(initialDate = '2099-10-24') {
  const props = {
    open: true,
    room: roomFixture,
    initialDate,
    onClose: vi.fn(),
    onCreated: vi.fn(),
    onConflict: vi.fn(),
  }

  render(<BookingModal {...props} />)

  return props
}

describe('BookingModal', () => {
  beforeEach(() => {
    mutationMocks.mutate.mockReset()
  })

  it('requires a meeting title', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: 'Забронировать' }))

    expect(screen.getByText('Обязательное поле')).toBeInTheDocument()
    expect(mutationMocks.mutate).not.toHaveBeenCalled()
  })

  it('rejects a booking in the past', async () => {
    const user = userEvent.setup()
    renderModal('2020-01-01')

    await user.type(
      screen.getByPlaceholderText('Укажите тему встречи'),
      'Планирование',
    )
    await user.click(screen.getByRole('button', { name: 'Забронировать' }))

    expect(
      screen.getByText('Нельзя создать бронирование в прошлом'),
    ).toBeInTheDocument()
    expect(mutationMocks.mutate).not.toHaveBeenCalled()
  })

  it('sends trimmed form data with an office-timezone interval', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(
      screen.getByPlaceholderText('Укажите тему встречи'),
      '  Планирование  ',
    )
    await user.type(
      screen.getByPlaceholderText(
        'Дополнительная информация для участников встречи...',
      ),
      '  Обсуждаем релиз  ',
    )
    await user.click(screen.getByRole('button', { name: 'Забронировать' }))

    expect(mutationMocks.mutate).toHaveBeenCalledWith(
      {
        roomId: roomFixture.id,
        title: 'Планирование',
        comment: 'Обсуждаем релиз',
        startsAt: '2099-10-24T15:00:00.000+03:00',
        endsAt: '2099-10-24T16:00:00.000+03:00',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    )
  })

  it('calls the conflict handler for BOOKING_CONFLICT', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    mutationMocks.mutate.mockImplementationOnce((_payload, options) => {
      options.onError(
        new ApiError(
          409,
          'BOOKING_CONFLICT',
          'Переговорная уже забронирована',
        ),
      )
    })

    await user.type(
      screen.getByPlaceholderText('Укажите тему встречи'),
      'Планирование',
    )
    await user.click(screen.getByRole('button', { name: 'Забронировать' }))

    expect(props.onConflict).toHaveBeenCalledTimes(1)
  })

  it('passes the created booking to the success handler', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    mutationMocks.mutate.mockImplementationOnce((_payload, options) => {
      options.onSuccess(bookingFixture)
    })

    await user.type(
      screen.getByPlaceholderText('Укажите тему встречи'),
      'Планирование',
    )
    await user.click(screen.getByRole('button', { name: 'Забронировать' }))

    expect(props.onCreated).toHaveBeenCalledWith(bookingFixture)
  })
})
