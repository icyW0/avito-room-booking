import { afterEach, describe, expect, it, vi } from 'vitest'
import { cancelBooking } from './cancelBooking'

describe('cancelBooking', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends DELETE and accepts an empty 204 response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(cancelBooking('booking-1')).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/bookings/booking-1', {
      method: 'DELETE',
    })
  })

  it('returns the backend cancellation error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'BOOKING_NOT_CANCELLABLE',
              message: 'Можно отменять только будущие бронирования',
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )

    await expect(cancelBooking('booking-1')).rejects.toEqual(
      expect.objectContaining({
        status: 400,
        code: 'BOOKING_NOT_CANCELLABLE',
      }),
    )
  })
})
