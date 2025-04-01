import { type NextPageWithLayout } from "~/pages/_app";
import { AdminLayout } from "~/components/Global/Layout";
import { AuthRequired } from "~/components/Global/AuthRequired";
import { ListViewPageComponent } from "~/components/Admin/ListViewPageComponent";
import {RoleSets} from "~/common/roles";

const ListView: NextPageWithLayout = () => {
  return (
    <AuthRequired roles={RoleSets.users}>
      <ListViewPageComponent />
    </AuthRequired>
  );
};

ListView.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default ListView;

