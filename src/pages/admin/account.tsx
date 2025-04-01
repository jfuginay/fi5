import { type NextPageWithLayout } from "~/pages/_app";
import { AuthRequired } from "~/components/Global/AuthRequired";
import { AccountPageComponent } from "~/components/Admin/AccountPageComponent";
import { AdminLayout } from "~/components/Global/Layout";
import {RoleSets} from "~/common/roles";

const Account: NextPageWithLayout = () => {
  return (
    <AuthRequired roles={RoleSets.users}>
      <AccountPageComponent />
    </AuthRequired>
  );
};

Account.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Account;
