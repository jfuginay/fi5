import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { groupRouter } from "~/server/api/routers/group";
import { addressRouter } from "~/server/api/routers/address";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  group: groupRouter,
  address: addressRouter
});

export const config = {
  api: {
    responseLimit: false,
  },
  user: {
    responseLimit: false,
  },
  group: {
    responseLimit: false,
  },
  address: {
    responseLimit: false,
  }

}

// export type definition of API
export type AppRouter = typeof appRouter;
