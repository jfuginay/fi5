import { type NextPageWithLayout } from "~/pages/_app";
import { RoleSets } from "~/common/roles";
import { AuthRequired } from "~/components/Global/AuthRequired";
import { AdminLayout } from "~/components/Global/Layout";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import MapPageComponent from "~/components/Admin/MapPageComponent/MapPageComponent";

const MapView: NextPageWithLayout = () => {
  return (
      <AuthRequired roles={RoleSets.users}>
        <MapPageComponent />
      </AuthRequired>
  );
};

MapView.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default MapView;
