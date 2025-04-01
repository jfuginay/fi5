
import React, {
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Address, UserRole, VisitStatus } from "@prisma/client";
import { api } from "~/utils/api";
import { CoordinatesWithAddresses } from "~/types";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  Heading,
  Select,
  Stack,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Feature, Polygon } from "@turf/turf";
import { RoleSets } from "~/common/roles";
import ReactMapGL, {
  CircleLayer,
  GeoJSONSource,
  GeoJSONSourceRaw,
  MapRef,
  Popup,
} from "react-map-gl";
import { env } from "~/env.mjs";
import {
  StatusColors,
  StatusNames,
} from "~/common/status";
import { LogVisitModal } from "~/components/Global/LogVisitModal";
import AssignAddressesModal from "~/components/Admin/MapPageComponent/Partial/AssignAddressesModal";
import { DrawControl } from "./Partial/draw-control";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  getMarkerFeatureCollection,
  getMarkerGeojson,
} from "~/components/Admin/MapPageComponent/Partial/geojson-helper";
import { useRouter } from "next/router";
import _ from 'lodash';

export const PendingHistoricIcon =
  "data:image/png;base64,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";

const MapPageComponent = () => {
  const router = useRouter()

  const [selectedGroup, setSelectedGroup] = useState<number | null | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<
    VisitStatus | undefined
  >();

  const [isAdmin, setIsAdmin] = useState(false);

  const [features, setFeatures] = useState<Feature<Polygon>[]>([]);

  const utils = api.useContext();

  api.user.currentWithGroup.useQuery(undefined, {
    onSuccess(user) {
      if (user?.role === UserRole.user) {
        setSelectedGroup(user.groupId);
      }
      setIsAdmin(RoleSets.admins.includes(user?.role));
    },
  });

  const groupsQuery = api.group.all.useQuery();

  const markers = api.address.map.useQuery(
    {
      group: selectedGroup,
      status: selectedStatus,
    },
    {
      onSuccess(markers) {
        setMarkersLayer(markers);
      },
    }
  );

  const mapRef = useRef<MapRef>(null);
  const drawRef = useRef<MapboxDraw>();

  const [selectedMarker, setSelectedMarker] =
    useState<CoordinatesWithAddresses | null>();

  const [address, setAddress] = useState<Address | null>();

  const {
    isOpen: isLogVisitModalOpen,
    onOpen: openLogVisitModal,
    onClose: closeLogVisitModal,
  } = useDisclosure();

  const {
    isOpen: isAssignAddressesModalOpen,
    onOpen: openAssignAddressesModal,
    onClose: closeAssignAddressesModal,
  } = useDisclosure();

  const handleAssignClick = () => {
    openAssignAddressesModal();
  };

  const handleAssignClickSuccess = () => {
    void utils.address.map.refetch();

    drawRef.current?.deleteAll();

    setSelectedAddresses([]);
    setFeatures([]);

    closeAssignAddressesModal();
  };

  const handleLogUpdate = (address: Address) => {
    setAddress(address);
    openLogVisitModal();
  };

  const handleLogUpdateSuccess = (address: Address | null) => {
    void utils.address.map.refetch();

    updateSelectedMarker(address);

    closeLogVisitModal();
  };

  const updateSelectedMarker = (address: Address | null) => {
    if (!selectedMarker) return;

    setSelectedMarker({
      ...selectedMarker,
      addresses: selectedMarker.addresses.map((a) =>
        a.id === address?.id ? address : a
      ),
    });
  };

  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);

  const onUpdate = React.useCallback((e: { features: Feature<Polygon>[] }) => {
    setFeatures(e.features);
  }, []);

  const onDelete = React.useCallback(() => {
    setSelectedAddresses([]);
    setFeatures([]);
    drawRef.current?.deleteAll();
  }, []);

  useEffect(() => {
    const addresses = [];

    for (const feature of features || []) {
      for (const m of markers.data || []) {
        if (booleanPointInPolygon([m.longitude, m.latitude], feature)) {
          addresses.push(...m.addresses);
        }
      }
    }

    setSelectedAddresses(_.uniqBy(addresses, "id"));
  }, [features]);

  const getMarkersLayer = (geojson: GeoJSONSourceRaw): CircleLayer => {
    return {
      id: "markers",
      type: "circle",
      source: geojson,
      paint: {
        "circle-color": { type: "identity", property: "status" },
        "circle-stroke-width": 0.6,
        "circle-stroke-color": "black",
        "circle-radius": 6,
      },
    };
  };

  const setMarkersLayer = (markers: CoordinatesWithAddresses[]) => {
    const map = mapRef.current?.getMap();

    if (!map) return;

    if (!map.getLayer("markers")) {
      try {
        map.addLayer(
          getMarkersLayer(getMarkerGeojson(markers) as GeoJSONSourceRaw)
        );
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    } else {
      (map.getSource("markers") as GeoJSONSource).setData(
        getMarkerFeatureCollection(markers) as GeoJSON.FeatureCollection
      );
    }
  };

  return (
    <Box>
      <ReactMapGL
        ref={mapRef}
        initialViewState={{
          latitude: 47.689046,
          longitude: -117.418077,
          zoom: 13,
        }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        style={{ width: "100%", height: "91vh" }}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onLoad={(map) => {
          setMarkersLayer(markers.data || []);
        }}
        onClick={(e) => {
          const map = mapRef.current?.getMap();

          if (!map) return;

          const features = map.queryRenderedFeatures(e.point, {
            layers: ["markers"],
          });

          const feature = features[0];

          const markerId = feature?.properties?.id as undefined | number;

          const marker = markers.data?.find((m) => m.id === markerId);

          setSelectedMarker(marker);
        }}
        onTouchStart={(e) => {
          const map = mapRef.current?.getMap();

          if (!map) return;

          const features = map.queryRenderedFeatures(e.point, {
            layers: ["markers"],
          });

          const feature = features[0];

          const markerId = feature?.properties?.id as undefined | number;

          const marker = markers.data?.find((m) => m.id === markerId);
          setSelectedMarker(marker);
        }}
        onTouchEnd={(e) => {
          const map = mapRef.current?.getMap();

          if (!map) return;

          const features = map.queryRenderedFeatures(e.point, {
            layers: ["markers"],
          });

          const feature = features[0];

          const markerId = feature?.properties?.id as undefined | number;

          const marker = markers.data?.find((m) => m.id === markerId);
          setSelectedMarker(marker);
        }}
      >
        <Box p={5}>
          <Flex
            justifyContent={"space-between"}
            className="sm:flex-col sm:items-end md:flex-row"
          >
            <Flex className="sm:flex-col md:flex-row">
              <FormControl maxWidth={250} className="sm:mr-0 md:mr-3">
                <Select defaultValue={"none"}
                    isDisabled={features.length > 0 || !isAdmin}
                    value={selectedGroup || undefined}
                    onChange={(e) => {
                      if (e.currentTarget.value === "none") {
                        setSelectedGroup(null);
                      } else if (e.currentTarget.value === "all") {
                        setSelectedGroup(undefined);
                      } else {
                        setSelectedGroup(
                            Number(e.currentTarget.value) as SetStateAction<
                                number | null | undefined
                            >
                        );
                      }
                    }}
                    backgroundColor={"white"}
                >
                  <option selected value={"none"}>
                    No Group
                  </option>
                  <option selected value={"all"}>
                    All Groups
                  </option>
                  {groupsQuery.data?.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                  maxWidth={250}
                  className="sm:mt-5 sm:mr-0 md:mt-0 md:mr-3"
              >
                <Select
                  isDisabled={features.length > 0}
                  onChange={(e) => {
                    if (e.currentTarget.value === "all") {
                      setSelectedStatus(undefined);
                    } else {
                      setSelectedStatus(e.currentTarget.value as VisitStatus);
                    }
                  }}
                  backgroundColor={"white"}
                  defaultValue={"pending"}
                >
                  <option value={"all"}>Status (All)</option>
                  {Object.entries(StatusNames).map((s, i) => (
                    <option key={i} value={s[0]}>
                      {s[1]}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Button
              hidden={!isAdmin || selectedAddresses.length === 0}
              onClick={handleAssignClick}
              isDisabled={selectedAddresses.length === 0}
              colorScheme={"teal"}
              minW={150}
              className="sm:mt-5 md:mt-0"
            >
              Assign {selectedAddresses.length} address{selectedAddresses.length > 1 ? "es" : "" }
            </Button>
            
          </Flex>
        </Box>

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            anchor="bottom"
            maxWidth={"500px"}
            onClose={() => setSelectedMarker(null)}
            closeOnClick={false}
          >
            <Card
              variant={"unstyled"}
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {selectedMarker.addresses.map((address) => (
                    <Box key={address.id}>
                      <Heading size="xs">
                        <Flex>
                          <svg
                            height={20}
                            viewBox="0 0 24 24"
                            className={"cursor-pointer stroke-none"}
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="6"
                              stroke={"black"}
                              strokeWidth="1"
                              fill={StatusColors[address.status]}
                            />
                          </svg>
                          {address.street}
                        </Flex>
                      </Heading>

                      <Flex gap="1">
                        {isAdmin && (
                          <Button
                            onClick={() => router.push(`/admin/address/${address.id}`)}
                            mt={2}
                            size={"sm"}
                            colorScheme={"gray"}
                          >
                            Details
                          </Button>
                        )}
                        <Button
                          onClick={() => handleLogUpdate(address)}
                          mt={2}
                          size={"sm"}
                          colorScheme={"blue"}
                        >
                          Log Visit
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Popup>
        )}

        {isAdmin && (
          <DrawControl
            displayControlsDefault={false}
            ref={drawRef}
            controls={{
              polygon: true,
              trash: true,
            }}
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            position={"bottom-left"}
          />
        )}
      </ReactMapGL>

      <LogVisitModal
        isOpen={isLogVisitModalOpen}
        onClose={closeLogVisitModal}
        addressId={address?.id}
        onSuccess={handleLogUpdateSuccess}
      />

      <AssignAddressesModal
        isOpen={isAssignAddressesModalOpen}
        onClose={closeAssignAddressesModal}
        addresses={selectedAddresses}
        onSuccess={handleAssignClickSuccess}
      />
    </Box>
  );
};

export default MapPageComponent;
