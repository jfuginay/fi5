import { type NextPageWithLayout } from "~/pages/_app";
import { AddressDetailsPageComponent } from "~/components/Admin/AddressDetailsPageComponent";
import { AdminLayout } from "~/components/Global/Layout";

const Address: NextPageWithLayout = () => {
  return <AddressDetailsPageComponent />
};

Address.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Address;
