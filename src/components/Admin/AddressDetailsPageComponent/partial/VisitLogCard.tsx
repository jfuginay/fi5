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
import { VisitWithAddress } from "~/types";

const VisitLogCard = ({ visit }: { visit: VisitWithAddress }) => {
  return (
    <Card>
      <CardBody>
        <Box mb={5}>
          <Text
            mb={2}
            color={"gray.500"}
          >{`Updated ${visit.createdAt.toLocaleDateString("en-US")} by ${
            visit.createdBy || "---"
          }`}</Text>

          <Text fontSize={"lg"}>
            {visit.name && (
              <Text as={"b"} display={"inline"}>
                {visit.name + " "}
              </Text>
            )}
            {visit.address.street}
          </Text>
          <Text fontSize={"small"}>
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
              <Text fontSize={"xl"} mb={2}>
                Latest Notes/Followup
              </Text>
              <Text>{visit.notes || "---"}</Text>
            </Box>
            <Box>
              <Text fontSize={"xl"} mb={2}>
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

export default VisitLogCard;
