import { afterEach, describe, expect, it, vi } from 'vitest'
import { bookingFixture } from '../../../test/fixtures'
import { getMyBookings } from './getMyBookings'

describe('getMyBookings', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends scope and office filters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [bookingFixture] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      getMyBookings({
        scope: 'upcoming',
        officeId: 'office-moscow',
      }),
    ).resolves.toEqual({ items: [bookingFixture] })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/bookings?scope=upcoming&officeId=office-moscow',
    )
  })

  it('converts an unsuccessful response to ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Произошла внутренняя ошибка сервера',
            },
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )

    await expect(getMyBookings({ scope: 'past' })).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Произошла внутренняя ошибка сервера',
      }),
    )
  })
})
