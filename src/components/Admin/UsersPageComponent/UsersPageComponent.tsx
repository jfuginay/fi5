import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Td,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { AssignUsersToGroupForm, CreateUserForm, EditUserForm } from "./Forms";

import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { api } from "~/utils/api";
import React, { useState } from "react";
import { type User, UserRole } from "@prisma/client";
import truncate from "~/utils/truncate";
import { EditIcon } from "@chakra-ui/icons";

const UsersPageComponent = () => {
  const users = api.user.list.useQuery();

  const currentUser = api.user.current.useQuery();

  const utils = api.useContext();

  const [editingUser, setEditingUser] = useState<User | null>();

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const isUserSelected = (user: User) =>
    selectedUsers.some((u) => u.id === user.id);

  const handleUserSelect = (user: User) => {
    if (isUserSelected(user)) {
      setSelectedUsers([...selectedUsers.filter((u) => u.id !== user.id)]);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const clearSelectedUsers = () => setSelectedUsers([]);

  const canEditUser = (user: User): boolean => {
    const isOwner = user.role === UserRole.owner;
    const isCurrentUserOwner = currentUser.data?.role === UserRole.owner;
    const isEditingThemself = user.id === currentUser.data?.id;

    return (!isOwner && isCurrentUserOwner && !isEditingThemself)
  };

  const {
    isOpen: isCreateUserModalOpen,
    onOpen: openCreateUserModal,
    onClose: closeCreateUserModal,
  } = useDisclosure();

  const {
    isOpen: isAssignUsersModalOpen,
    onOpen: openAssignUsersModal,
    onClose: closeAssignUsersModal,
  } = useDisclosure();

  const {
    isOpen: isEditUserModalOpen,
    onOpen: openEditUserModal,
    onClose: closeEditUsersModal,
  } = useDisclosure();

  const handleEditUserSuccess = () => {
   void utils.user.list.refetch()

   closeEditUsersModal()
  }

  return (
    <Box p={5}>
      <Flex
        w="full"
        paddingLeft={5}
        paddingRight={5}
        mb={5}
        justifyContent={"space-between"}
      >
        <Text fontSize={"2xl"} color={"teal.400"}>
          Users
        </Text>

        <Flex gap={3}>
          <Button
            onClick={openCreateUserModal}
            leftIcon={<MdAdd fontSize={22} />}
            colorScheme="teal"
          >
            Add
          </Button>

          <Button
            isDisabled={selectedUsers.length === 0}
            onClick={openAssignUsersModal}
            colorScheme="teal"
          >
            Assign
          </Button>
        </Flex>
      </Flex>

      <CreateUserForm
        isOpen={isCreateUserModalOpen}
        onClose={closeCreateUserModal}
      />

      <AssignUsersToGroupForm
        isOpen={isAssignUsersModalOpen}
        onClose={closeAssignUsersModal}
        users={selectedUsers}
        clearSelectedUsers={clearSelectedUsers}
      />

      {editingUser && (
        <EditUserForm
          isOpen={isEditUserModalOpen}
          onClose={closeEditUsersModal}
          onSuccess={handleEditUserSuccess}
          user={editingUser}
        />
      )}

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Group</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.data?.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Checkbox
                    colorScheme={"teal"}
                    isChecked={isUserSelected(user)}
                    onChange={() => handleUserSelect(user)}
                  />
                </Td>
                <Td>{truncate(user.name, 25)}</Td>
                <Td>{truncate(user.email, 30)}</Td>
                <Td>{user.role}</Td>
                <Td>{truncate(user.group?.name, 35) || "-"}</Td>
                <Td>
                  <IconButton
                    isDisabled={!canEditUser(user)}
                    variant={'unstyled'}
                    aria-label={"Edit"}
                    onClick={() => {
                      setEditingUser(user);
                      openEditUserModal();
                    }}
                    icon={<EditIcon />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersPageComponent;
