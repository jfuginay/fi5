import { type NextPageWithLayout } from "~/pages/_app";
import { AuthRequired } from "~/components/Global/AuthRequired";
import { RoleSets } from "~/common/roles";
import { JoinGroupPageComponent } from "~/components/Groups/JoinGroupPageComponent";

const Group: NextPageWithLayout = () => {
  return (
    <AuthRequired roles={RoleSets.users} allowNoGroup>
      <JoinGroupPageComponent />
    </AuthRequired>
  );
};

export default Group;
