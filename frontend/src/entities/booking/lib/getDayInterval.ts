import { TZDate } from '@date-fns/tz'
import { addDays } from 'date-fns'

interface GetDayIntervalParams {
  date: string
  timezone: string
}

interface DayInterval {
  from: string
  to: string
}

export function getDayInterval({
  date,
  timezone,
}: GetDayIntervalParams): DayInterval {
  const [year, month, day] = date.split('-').map(Number)

  const from = new TZDate(year, month - 1, day, 0, 0, 0, timezone)

  const to = addDays(from, 1)

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  }
}
