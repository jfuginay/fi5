import { useSession } from "next-auth/react";
import { Button, Center, Flex, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";

import type { ReactNode } from "react";
import { UserRole } from "@prisma/client";
import { RoleSets } from "~/common/roles";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function AuthRequired({
  children,
  roles,
  allowNoGroup = false,
}: {
  children: ReactNode;
  roles: UserRole[];
  allowNoGroup?: boolean;
}) {
  const { status, data } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return (
      <Center h={"90vh"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="teal.400"
          color=""
          size="xl"
        />
      </Center>
    );
  }

  if (
    status === "unauthenticated" ||
    !data ||
    !roles.includes(data.user.role)
  ) {
    return (
      <Center h={"85vh"}>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={3}
          textAlign={"center"}
          margin={"0 20px"}
        >
          <Text
            as={"b"}
            fontSize={{ md: "7xl", base: "5xl" }}
            color={"red.400"}
          >
            Access denied
          </Text>
          <Text fontSize={"xl"}>
            You need to sign in before you can access this page
          </Text>

          <Button onClick={() => void router.push("/")}>Back to home</Button>
        </Flex>
      </Center>
    );
  }

  if (
    data.user.role == UserRole.user &&
    data.user.groupId === null &&
    !allowNoGroup
  ) {
    return (
      <Center h={"85vh"}>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
          margin={"0 20px"}
        >
          <Text
            as={"b"}
            fontSize={{ md: "7xl", base: "5xl" }}
            color={"red.400"}
          >
            Access denied
          </Text>

          <Text fontSize={"xl"}>
            You need to belong to a group before you can access Faith in Five
          </Text>
        </Flex>
      </Center>
    );
  }

  return <main>{children}</main>;
}
