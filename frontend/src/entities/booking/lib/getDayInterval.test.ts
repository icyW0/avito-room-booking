import { describe, expect, it } from 'vitest'
import { getDayInterval } from './getDayInterval'

describe('getDayInterval', () => {
  it('returns the full day in the office timezone', () => {
    expect(
      getDayInterval({
        date: '2026-10-24',
        timezone: 'Europe/Moscow',
      }),
    ).toEqual({
      from: '2026-10-24T00:00:00.000+03:00',
      to: '2026-10-25T00:00:00.000+03:00',
    })
  })
})
