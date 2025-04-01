import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { Prisma, VisitStatus } from "@prisma/client";
import { AllowAccess, RoleSets } from "~/server/middleware/roles";
import AddressFindManyArgs = Prisma.AddressFindManyArgs;

export const addressRouter = createTRPCRouter({

  create: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(
      z.object({
        street: z.string(),
        unit: z.string().nullable(),
        city: z.string(),
        state: z.string(),
        group: z.number().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await axios.get(
        "https://us-street.api.smartystreets.com/street-address",
        {
          params: {
            "auth-id": env.SMARTY_AUTH_ID,
            "auth-token": env.SMARTY_AUTH_TOKEN,
            street: input.street,
            secondary: input.unit,
            city: input.city,
            state: input.state,
            license: "us-rooftop-geocoding-cloud",
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid address",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const address = response.data[0];

      const coordinatePayload = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        latitude: address.metadata.latitude,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        longitude: address.metadata.longitude,
      };

      const coordinate = await ctx.prisma.coordinate.upsert({
        where: {
          coordinates: coordinatePayload,
        },
        update: {},
        create: coordinatePayload,
      });

      const addressPayload = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        street: address.delivery_line_1,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        unit: address.components.secondary,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        city: address.components.city_name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        state: address.components.state_abbreviation,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
        zipCode: `${address.components.zipcode}-${address.components.plus4_code}`,
        coordinateId: coordinate.id,
        groupId: input.group || undefined,
      };

      return ctx.prisma.address.create({ data: addressPayload });
    }),

  list: protectedProcedure
      .use(AllowAccess(RoleSets.users)) // Assuming this allows access to both users and admins
      .input(
          z.object({
            pageSize: z.number().default(10),
            pageIndex: z.number().default(0),
            search: z.string().optional(),
            status: z.nativeEnum(VisitStatus).optional(),
          })
      )
      .query(async ({ ctx, input }) => {
        const queryArgs = {} as AddressFindManyArgs;

        // Adjust query based on search criteria
        if (input.search) {
          queryArgs.where = {
            OR: [
              {
                street: {
                  contains: input.search,
                  mode: "insensitive",
                },
              },
              {
                group: {
                  name: {
                    contains: input.search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          };
        }

        // Filter by status if provided
        if (input.status) {
          queryArgs.where = {
            ...queryArgs.where,
            status: {
              equals: input.status,
            },
          };
        }

        const isAdmin = ctx.session.user.role === 'admin';
        const userGroupId = ctx.session.user.groupId;

        // If the user is not an admin and is part of a group, filter by the user's group
        if (!isAdmin && userGroupId) {
          queryArgs.where = {
            ...queryArgs.where,
            groupId: userGroupId,
          };
        }

        const count = await ctx.prisma.address.count({ where: queryArgs.where});

        const addresses = await ctx.prisma.address.findMany({
          ...queryArgs,
          skip: input.pageIndex * input.pageSize,
          take: input.pageSize,
          orderBy: [{ street: "asc" }],
          include: {
            group: {
                select: { name: true },
            }
          },
        });

        return {
          count,
          addresses,
        };
      }),



  findById: protectedProcedure
    .use(AllowAccess(RoleSets.users))

    .input(z.object({ addressId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.address.findUnique({
        where: { id: input.addressId },
        include: {
          visits: {
            orderBy: [{ createdAt: "desc" }],
            include: { address: true },
          },
        },
      });
    }),

  logVisit: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(
      z.object({
        addressId: z.number(),
        name: z.string().nullable(),
        contact: z.string().nullable(),
        status: z.enum([
          VisitStatus.u,
          VisitStatus.a,
          VisitStatus.v,
          VisitStatus.f,
          VisitStatus.fu,
          VisitStatus.fc,
          VisitStatus.dnv,
          VisitStatus.pr,
        ]),
        childrenK5InHome: z.boolean().nullable(),
        notes: z.string().nullable(),
        prayerRequest: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { addressId, ...data } = input;

      return ctx.prisma.address.update({
        where: { id: addressId },
        data: { ...data, updatedBy: ctx.session.user.name || ctx.session.user.email },
      });
    }),

  map: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(
      z.object({
        group: z.number().nullish(),
        status: z.nativeEnum(VisitStatus).optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.coordinate.findMany({
        where: {
          addresses: {
            some: {
              groupId: input.group,
              status: input.status,
            },
          },
        },
        include: {
          addresses: true,
        },
      });
    }),

  findAllAddresses: protectedProcedure
    .use(AllowAccess(RoleSets.users))

    .query(({ ctx }) => {
      return ctx.prisma.address.findMany({
        include: {
          visits: {
            orderBy: [{ createdAt: "desc" }],
            include: { address: true },
          },
        },
      });
    }),
  findAllVisits: protectedProcedure
      .use(AllowAccess(RoleSets.admins))
      .query(({ ctx }) => {
        return ctx.prisma.visit.findMany({
          include: {
            address: true, // Make sure to include the address in the result
            // make size smaller by only including the necessary fields
            // do not include any that are of status u or dnv
          },
            where: {
              status: {
                notIn: [VisitStatus.u, VisitStatus.dnv],
              },
            },
          });
        }
        ),
});
