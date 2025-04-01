import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRole } from ".prisma/client";
import { AllowAccess, RoleSets } from "~/server/middleware/roles";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .use(AllowAccess(RoleSets.owner))
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        role: z.enum([UserRole.user, UserRole.admin]),
        group: z.number().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          role: input.role,
          groupId: input.group,
        },
      });
    }),

  list: protectedProcedure.use(AllowAccess(RoleSets.users)).query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      orderBy: [{ name: "asc" }],
      include: { group: true },
    });
  }),

  currentWithGroup: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .query(({ ctx }) => {
      return ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { group: true },
      });
    }),

  current: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .query(({ ctx }) => {
      return ctx.session.user;
    }),

  updateCurrent: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

    changeCurrentGroup: protectedProcedure
        .use(AllowAccess(RoleSets.users))
        .input(z.object({group: z.number()}))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: {groupId: input.group},
            });
        }),
});
