import {UserRole} from "@prisma/client";

export const RoleSets = {
    admins: [UserRole.admin, UserRole.owner] as any[],
    users: [UserRole.user, UserRole.admin, UserRole.owner] as any[]
}
