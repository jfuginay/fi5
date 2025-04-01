import React, { type ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  type BoxProps,
  type FlexProps,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { type IconType } from "react-icons";
import { type ReactText } from "react";
import {
  MdSpaceDashboard,
  MdViewList,
  MdPeople,
  MdAccountCircle,
  MdExitToApp,
  MdGroup,
} from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { api } from "~/utils/api";
import { UserRole } from "@prisma/client";

enum LinkItem {
  dashboard = "dashboard",
  map = "map",
  list = "list",
  groups = "groups",
  users = "users",
}

interface LinkItemProps {
  id: LinkItem;
  name: string;
  icon: IconType;

  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  {
    id: LinkItem.dashboard,
    name: "Dashboard",
    icon: MdSpaceDashboard,
    url: "/admin/dashboard",
  },
  {
    id: LinkItem.map,
    name: "Map View",
    icon: SiOpenstreetmap,
    url: "/admin/map-view",
  },
  {
    id: LinkItem.list,
    name: "List View",
    icon: MdViewList,
    url: "/admin/list-view",
  },
  { id: LinkItem.groups, name: "Groups", icon: MdGroup, url: "/admin/groups" },
  { id: LinkItem.users, name: "Users", icon: MdPeople, url: "/admin/users" },
];

const displayToRole: { [key: string]: LinkItem[] } = {
  [UserRole.owner]: [
    LinkItem.dashboard,
    LinkItem.map,
    LinkItem.list,
    LinkItem.groups,
    LinkItem.users,
  ],
  [UserRole.admin]: [
    LinkItem.dashboard,
    LinkItem.map,
    LinkItem.list,
    LinkItem.groups,
    LinkItem.users,
  ],
  [UserRole.user]: [
    LinkItem.map,
    LinkItem.list],
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = api.user.current.useQuery();

  return (
    <Box minH="100vh" bg={useColorModeValue("", "gray.900")}>
      <SidebarContent
        role={user.data?.role || UserRole.user}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            role={user.data?.role || UserRole.user}
            onClose={onClose}
          />
        </DrawerContent>
      </Drawer>
      <Navbar onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  role: UserRole;
  onClose: () => void;
}

const SidebarContent = ({ onClose, role, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.filter((item) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        displayToRole[role || UserRole.user].includes(item.id)
      ).map((link) => (
        <Link key={link.name} href={link.url}>
          <NavItem onClick={onClose} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))}
      <Flex w={"full"} pos="absolute" bottom={0} direction={"column"}>
        <Link href={"/admin/account"}>
          <NavItem onClick={onClose} icon={MdAccountCircle} w="90%">
            My Account
          </NavItem>
        </Link>

        <NavItem
          onClick={() => void signOut({ callbackUrl: "/" })}
          icon={MdExitToApp}
          w="90%"
        >
          Logout
        </NavItem>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon?: IconType;

  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "teal.400",
        color: "white",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="20"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const Navbar = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"teal.500"}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Flex
        w="full"
        justifyContent={{ md: "space-between", base: "center" }}
        alignItems={"center"}
      >
        <Text
          display={{ base: "none", md: "inline-block" }}
          as="b"
          fontSize="3xl"
          color={"white"}
        >
          Faith In Five
        </Text>
        <Image
          src={"/faith_bible_church_logo.png"}
          alt={"No Logo"}
          width={400}
          height={400}
        />
      </Flex>
    </Flex>
  );
};
