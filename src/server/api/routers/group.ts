import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AllowAccess, RoleSets } from "~/server/middleware/roles";
import { VisitStatus } from "@prisma/client";

export const groupRouter = createTRPCRouter({
  create: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(z.object({ name: z.string().min(4).max(50) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.group.create({
        data: input,
      });
    }),

  assignUsers: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(z.object({ group: z.number(), users: z.array(z.string()) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.updateMany({
        where: { id: { in: input.users } },
        data: { groupId: Number(input.group) },
      });
    }),

  assignAddresses: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(
      z.object({
        addresses: z.array(z.number()),
        group: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.address.updateMany({
        where: {
          AND: [
            {
              id: {
                in: input.addresses,
              },
            },

            {
              status: {
                equals: VisitStatus.u,
              },
            },
          ],
        },

        data: {
          status: VisitStatus.a,
        },
      });

      await ctx.prisma.address.updateMany({
        where: {
          id: {
            in: input.addresses,
          },
        },
        data: {
          groupId: Number(input.group),
        },
      });

      return ctx.prisma.address.findMany({
        where: {
          id: {
            in: input.addresses,
          },
        },
      });
    }),

  all: protectedProcedure.use(AllowAccess(RoleSets.users)).query(({ ctx }) => {
    const isAdmin = RoleSets.admins.includes(ctx.session.user.role);


    return isAdmin
      ? ctx.prisma.group.findMany()
      : ctx.prisma.group.findMany({ where: { id: Number(ctx.session.user.groupId) } });
  }),

  findById: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.group.findUniqueOrThrow({ where: { id: Number(input) } });
    }),
});
