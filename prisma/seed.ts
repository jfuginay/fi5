import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.visit.deleteMany()
  await prisma.address.deleteMany()
  await prisma.coordinate.deleteMany()

  await prisma.address.create({
    data: {
      street: '2416 N Lincoln St',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99205-3339',
      coordinates: {
        create: {
          latitude: 47.679966,
          longitude: -117.424866
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '428 E Dalton Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99207-1941',
      coordinates: {
        create: {
          latitude: 47.686844,
          longitude: 47.686844
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '1905 W Mallon Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99201-1758',
      coordinates: {
        create: {
          latitude: 47.665051,
          longitude: -117.440781
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '2518 E Boone Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99202-3716',
      coordinates: {
        create: {
          latitude: 47.6684,
          longitude: -117.372826
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '541 E Central Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99208-1120',
      coordinates: {
        create: {
          latitude: 47.711632,
          longitude: -117.401421
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '1123 W 14th Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99204-3900',
      coordinates: {
        create: {
          latitude: 47.64241,
          longitude: -117.428978
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '4803 N Lee St',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99207-4228',
      coordinates: {
        create: {
          latitude: 47.701557,
          longitude: -117.377808
        }
      }
    }
  })

  await prisma.address.create({
    data: {
      street: '2430 E Francis Ave',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99208-2425',
      coordinates: {
        create: {
          latitude: 47.714649,
          longitude: -117.373535
        }
      }
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
