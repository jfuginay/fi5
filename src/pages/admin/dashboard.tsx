/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-no-comment-textnodes */
import Link from "next/link";
import type { NextPageWithLayout } from "~/pages/_app";
import { AdminLayout } from "~/components/Global/Layout";
import { AuthRequired } from "~/components/Global/AuthRequired";
import {
  Flex,
  Text,
  useColorModeValue,
  Card,
  Heading,
  Button,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { RoleSets } from "~/common/roles";
import { api } from "~/utils/api";
import {getStatusColor, StatusColors, StatusNames} from "~/common/status";

const Dashboard: NextPageWithLayout = () => {
  const visits = api.address.findAllVisits.useQuery();

  // initializing dashboard values
  let remainingFollowups = 0;
  let completedFollowups = 0;
  let completedVisits = 0;

  // find markers that are assigned to the current user's group for dashboard values
  // const filteredMarkersById = visits.data?.filter((marker) => {
  //   return marker.addresses.some((address) => {
  //     return address.groupId === currentGroup?.id;
  //   });
  // });

  // find markers that are assigned to the current user's group for dashboard display
  const filteredMarkersByStatus = visits.data?.filter(
    (visit ) =>
        visit.status === "f" ||
        visit.status === "fu" ||
        visit.status === "fc" ||
        visit.status === "u" ||
          visit.status === "a"
    );
  // calculate dashboard values and create array of neighbors to display
  filteredMarkersByStatus?.map((visit) => {
    if (
      visit.status === "f" ||
      visit.status === "fu"
    )
      remainingFollowups++;
    if (visit?.status === "fc") completedFollowups++;
    if (
      visit &&
      visit.status !== "u" &&
      visit.status !== "a"
    )
      completedVisits++;
  });

  return (
    <AuthRequired roles={RoleSets.users}>
      <Flex justifyContent="space-evenly" mt="10" maxH="84.3vh" mx="5">
        <Flex flexDirection="column" w="50%" px="7">
          <Flex flexDirection="column">
            <Heading
              as="h2"
              fontSize="1.5rem"
              fontWeight="semi-bold"
              color="teal.500"
            >
              Followup & Prayer Requests
            </Heading>
            <Text fontSize="1rem" color="gray.600" mb="4">
              You have {remainingFollowups} visits to followup on
            </Text>
          </Flex>
          <Stack overflowY="scroll" pr="1" pb="5" spacing="1rem">
            {filteredMarkersByStatus?.map((visit, idx) => {
              return (
                <Card
                  key={idx}
                  boxShadow="md"
                  borderRadius="md"
                  p="3"
                  variant="outline"
                >
                  <Text fontSize="1rem" color="gray.600">
                    <Text as="b">
                      {visit?.name || "No Name"}{" "}
                    </Text>
                    {visit?.address.street}
                  </Text>
                  <Flex fontSize="0.7rem" alignItems="center" color="gray.500">
                    <Icon
                      viewBox="0 0 200 200"
                      fill={StatusColors[visit?.address.status]}
                    >
                      <path d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
                    </Icon>
                    <Text pl="1">
                      STATUS:{" "}
                      {visit?.status &&
                        StatusNames[
                          visit?.status
                        ]?.toUpperCase()}
                    </Text>
                  </Flex>
                  <Button
                    colorScheme="blue"
                    h="1.7em"
                    w="5em"
                    my="2"
                    fontWeight="light"
                  >
                    <Link
                      href={`/admin/address/${
                        visit?.id || "not-found"
                      }`}
                    >
                      DETAILS
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </Stack>
        </Flex>

        <Flex
          border="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        ></Flex>

        <Flex flexDirection="column" w="50%" px="7">
          <Flex flexDirection="column">
            <Heading
              as="h2"
              fontSize="1.5rem"
              fontWeight="semi-bold"
              color="teal.500"
            >
              Assigned
            </Heading>
            <Text fontSize="1rem" color="gray.600">
              There are currently {filteredMarkersByStatus?.length || 0} visits
              assigned
            </Text>
          </Flex>
          <Flex flexDirection="column" mt="4em">
            <Heading
              as="h2"
              fontSize="1.5rem"
              fontWeight="semi-bold"
              color="teal.500"
            >
              Completed
            </Heading>
            <Text fontSize="1rem" color="gray.600" mt="1">
              <Text
                as="span"
                color="blue.500"
                fontSize="2rem"
                fontWeight="bold"
              >
                {completedVisits}{" "}
              </Text>
              visits completed
            </Text>
            <Text fontSize="1rem" color="gray.600" mt="1">
              <Text
                as="span"
                color="green.500"
                fontSize="2rem"
                fontWeight="bold"
              >
                {completedFollowups}{" "}
              </Text>
              followups completed
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AuthRequired>
  );
};

Dashboard.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Dashboard;
