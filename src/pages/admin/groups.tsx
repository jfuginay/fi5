import { type NextPageWithLayout } from "~/pages/_app";
import { AdminLayout } from "~/components/Global/Layout";

import { AuthRequired } from "~/components/Global/AuthRequired";
import { GroupsPageComponent } from "~/components/Admin/GroupsPageComponent";
import {RoleSets} from "~/common/roles";

const Groups: NextPageWithLayout = () => {
  return (
    <AuthRequired roles={RoleSets.admins}>
      <GroupsPageComponent />
    </AuthRequired>
  );
};

Groups.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Groups;
