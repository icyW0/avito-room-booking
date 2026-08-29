import { describe, expect, it } from 'vitest'
import { getRealtimeQueryKeys } from './getRealtimeQueryKeys'

function createEvent(type: string, data: Record<string, unknown>) {
  return JSON.stringify({
    type,
    occurredAt: '2026-08-29T10:00:00.000Z',
    data,
  })
}

describe('getRealtimeQueryKeys', () => {
  it.each(['booking.created', 'booking.cancelled'])(
    'updates the room schedule and user bookings for %s',
    (type) => {
      expect(
        getRealtimeQueryKeys(
          createEvent(type, { booking: { roomId: 'room-everest' } }),
        ),
      ).toEqual([['room-bookings', 'room-everest'], ['bookings']])
    },
  )

  it('updates the rooms list when availability changes', () => {
    expect(
      getRealtimeQueryKeys(
        createEvent('room.availability_changed', {
          roomId: 'room-everest',
          available: false,
        }),
      ),
    ).toEqual([['rooms']])
  })

  it('requests a full resync after data reset', () => {
    expect(getRealtimeQueryKeys(createEvent('data.reset', {}))).toEqual([null])
  })

  it('ignores malformed and unknown messages', () => {
    expect(getRealtimeQueryKeys('not-json')).toEqual([])
    expect(getRealtimeQueryKeys(createEvent('unknown.event', {}))).toEqual([])
    expect(
      getRealtimeQueryKeys(createEvent('booking.created', { booking: {} })),
    ).toEqual([])
  })
})
