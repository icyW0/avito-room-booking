import { describe, expect, it } from 'vitest'
import { getBookingInterval } from './getBookingInterval'

describe('getBookingInterval', () => {
  it('creates an interval in the office timezone', () => {
    expect(
      getBookingInterval({
        date: '2026-10-24',
        startTime: '15:00',
        duration: 60,
        timezone: 'Europe/Moscow',
      }),
    ).toEqual({
      startsAt: '2026-10-24T15:00:00.000+03:00',
      endsAt: '2026-10-24T16:00:00.000+03:00',
    })
  })

  it('supports the minimum 15 minute duration', () => {
    expect(
      getBookingInterval({
        date: '2026-10-24',
        startTime: '09:00',
        duration: 15,
        timezone: 'Europe/Moscow',
      }),
    ).toEqual({
      startsAt: '2026-10-24T09:00:00.000+03:00',
      endsAt: '2026-10-24T09:15:00.000+03:00',
    })
  })
})
