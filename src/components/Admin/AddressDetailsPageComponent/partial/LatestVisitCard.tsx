import {
  Box,
  Card,
  CardBody,
  Flex,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { StatusNames } from "~/common/status";
import { type VisitWithAddress } from "~/types";

const LatestVisitCard = ({ visit }: { visit: VisitWithAddress }) => {
  return (
    <Card variant={"unstyled"} mb={5}>
      <CardBody>
        <Box mb={5}>
          <Text
            color={"gray.500"}
          >{`Updated ${visit.createdAt.toLocaleDateString("en-US")} by ${
            visit.createdBy || "---"
          }`}</Text>
          <Text fontSize={"2xl"}>
            {visit.name && (
              <Text as={"b"} display={"inline"}>
                {visit.name + " "}
              </Text>
            )}
            {visit.address.street}
          </Text>
          <Text fontSize={"md"}>
            STATUS: {StatusNames[visit.status]?.toUpperCase()}
          </Text>
        </Box>

        <Stack divider={<StackDivider />} spacing="4">
          <Flex
            justifyContent={"space-between"}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <Box display={"flex"} flexDirection={"column"}>
              <Text>
                <Text display={"inline"} as={"b"}>
                  Church attendance:{" "}
                </Text>{" "}
                {visit.attendance || "---"}
              </Text>
              <Text>
                <Text display={"inline"} as={"b"}>
                  Interested In Learning More about Faith:{" "}
                </Text>
                {visit.interested === null && "---"}
                {typeof visit.interested === "boolean" &&
                  (visit.interested ? "Yes" : "No")}
              </Text>

              <Text>
                <Text display={"inline"} as={"b"}>
                    Children K-5 in the home:{" "}
                </Text>

                {visit.childrenK5InHome === null && "---"}
                {typeof visit.childrenK5InHome === "boolean" &&
                  (visit.childrenK5InHome ? "Yes" : "No")}
              </Text>
            </Box>

            <Box>
              <Text>
                <Text display={"inline"} as={"b"}>
                  Contact:{" "}
                </Text>
                {visit.contact || "---"}
              </Text>
            </Box>
          </Flex>

          <Flex
            justifyContent={"space-between"}
            flexDirection={{ base: "column", lg: "row" }}
            gap={3}
          >
            <Box>
              <Text color={"teal.400"} fontSize={"2xl"} mb={2}>
                Latest Notes/Followup
              </Text>
              <Text>{visit.notes || "---"}</Text>
            </Box>
            <Box>
              <Text color={"teal.400"} fontSize={"2xl"} mb={2}>
                Latest Prayer Request
              </Text>
              <Text>{visit.prayerRequest || "---"}</Text>
            </Box>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default LatestVisitCard;
