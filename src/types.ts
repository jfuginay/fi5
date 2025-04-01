import { Prisma } from '@prisma/client'

const coordinatesWithAddresses = Prisma.validator<Prisma.CoordinateArgs>()({
  include: {
    addresses: true
  },
})

const visitWithAddress = Prisma.validator<Prisma.VisitArgs>()({
  include: {
    address: true
  },
})

const addressWithVisits = Prisma.validator<Prisma.AddressArgs>()({
  include: {
    visits: true,
  },
})

const addressWithGroupsAndVisits = Prisma.validator<Prisma.AddressArgs>()({
  include: {
    group: true
  },
})

export type CoordinatesWithAddresses = Prisma.CoordinateGetPayload<
  typeof coordinatesWithAddresses
>

export type VisitWithAddress = Prisma.VisitGetPayload<
  typeof visitWithAddress
>

export type AddressWithVisits = Prisma.AddressGetPayload<
  typeof addressWithVisits
>

export type AddressWithGroupsAndVisits = Prisma.AddressGetPayload<
    typeof addressWithGroupsAndVisits
>
