import type { Booking } from '../entities/booking/model/types'
import type { Room } from '../entities/room/model/types'

export const roomFixture: Room = {
  id: 'room-everest',
  officeId: 'office-moscow',
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [],
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'Москва, ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
}

export const bookingFixture: Booking = {
  id: 'booking-1',
  roomId: roomFixture.id,
  userId: 'user-konstantin',
  title: 'Daily Sync: Разработка & Продукт',
  comment: null,
  startsAt: '2026-10-24T12:00:00.000Z',
  endsAt: '2026-10-24T13:00:00.000Z',
  createdAt: '2026-10-20T10:00:00.000Z',
  room: {
    id: roomFixture.id,
    officeId: roomFixture.officeId,
    name: roomFixture.name,
    floor: roomFixture.floor,
    capacity: roomFixture.capacity,
    features: roomFixture.features,
  },
  office: roomFixture.office,
  owner: {
    id: 'user-konstantin',
    login: 'kkuznetsov',
    displayName: 'Константин Кузнецов',
    email: 'kkuznetsov@example.test',
    avatarUrl: null,
    initials: 'КК',
  },
}
