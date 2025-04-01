import { type NextPageWithLayout } from "~/pages/_app";
import { Center, Flex, Text } from "@chakra-ui/react";
import { AppLayout } from "~/components/Global/Layout";

const Unauthorized: NextPageWithLayout = () => {
  return (
    <Center h={"85vh"}>
      <Flex
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        textAlign={"center"}
        margin={"0 20px"}
      >
        <Text as={"b"} fontSize={{ md: "7xl", base: "5xl" }} color={"red.400"}>
          Access denied
        </Text>

        <Text as={"b"} fontSize={{ md: "2xl", base: "xl" }} color={"teal.400"}>
          Please contact the owner to whitelist your email address.
        </Text>
      </Flex>
    </Center>
  );
};

Unauthorized.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Unauthorized;
