import {UserRole} from "@prisma/client";
import {middleware} from "~/server/api/trpc";
import {TRPCError} from "@trpc/server";

export const AllowAccess = (roles: UserRole[]) => {
    return middleware(({ ctx, next }) => {
        if (!ctx.session || !ctx.session.user || !roles.includes(ctx.session.user.role)) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                // infers the `session` as non-nullable
                session: { ...ctx.session, user: ctx.session.user },
            },
        });
    })
}

export const RoleSets = {
    owner: [UserRole.owner] as UserRole[],
    admins: [UserRole.admin, UserRole.owner] as UserRole[],
    users: [UserRole.user, UserRole.admin, UserRole.owner] as UserRole[]
}
