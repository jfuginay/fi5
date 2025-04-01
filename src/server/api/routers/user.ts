import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRole } from "@prisma/client"; // Update import to use @prisma/client
import { AllowAccess, RoleSets } from "~/server/middleware/roles";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .use(AllowAccess(RoleSets.admins))
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        role: z.enum([UserRole.user, UserRole.admin]).default(UserRole.user),
        groupId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.create({
        data: {
          ...input,
          emailVerified: new Date(), // Add this for NextAuth compatibility
        },
      });
    }),

  update: protectedProcedure
    .use(AllowAccess(RoleSets.owner))
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        role: z.enum([UserRole.user, UserRole.admin]),
        groupId: z.number().optional(), // Changed from group to groupId for consistency
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          role: input.role,
          groupId: input.groupId,
        },
      });
    }),

  list: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .query(async ({ ctx }) => {
      return ctx.prisma.user.findMany({
        orderBy: [{ name: "asc" }],
        include: { 
          group: true,
          accounts: false, // Exclude sensitive auth data
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          groupId: true,
          group: true,
          emailVerified: true,
          image: true,
        },
      });
    }),

  currentWithGroup: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .query(async ({ ctx }) => {
      return ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { 
          group: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          groupId: true,
          group: true,
          emailVerified: true,
          image: true,
        },
      });
    }),

  current: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .query(({ ctx }) => {
      return ctx.session.user;
    }),

  updateCurrent: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(
      z.object({ 
        name: z.string().min(1).max(100),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          groupId: true,
          image: true,
        },
      });
    }),

  changeCurrentGroup: protectedProcedure
    .use(AllowAccess(RoleSets.users))
    .input(z.object({ groupId: z.number() })) // Changed from group to groupId for consistency
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { groupId: input.groupId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          groupId: true,
          group: true,
        },
      });
    }),
});
