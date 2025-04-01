import { type NextPageWithLayout } from "~/pages/_app";
import { AdminLayout } from "~/components/Global/Layout";
import { AuthRequired } from "~/components/Global/AuthRequired";
import { UsersPageComponent } from "~/components/Admin/UsersPageComponent";
import {RoleSets} from "~/common/roles";

const Users: NextPageWithLayout = () => {
  return (
    <AuthRequired roles={RoleSets.admins}>
      <UsersPageComponent />
    </AuthRequired>
  );
};

Users.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Users;
