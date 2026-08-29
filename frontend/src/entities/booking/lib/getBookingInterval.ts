import { TZDate } from '@date-fns/tz'
import { addMinutes } from 'date-fns'

interface GetBookingIntervalParams {
  date: string
  startTime: string
  duration: number
  timezone: string
}

interface BookingInterval {
  startsAt: string
  endsAt: string
}

export function getBookingInterval({
  date,
  startTime,
  duration,
  timezone,
}: GetBookingIntervalParams): BookingInterval {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = startTime.split(':').map(Number)

  const startsAt = new TZDate(year, month - 1, day, hours, minutes, 0, timezone)

  const endsAt = addMinutes(startsAt, duration)

  return {
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  }
}
