import { type User } from "@prisma/client";
import { api } from "~/utils/api";
import React, { useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

const AssignUsersToGroupForm = ({
  isOpen,
  onClose,
  users,
  clearSelectedUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  clearSelectedUsers: () => void;
}) => {
  const groups = api.group.all.useQuery();

  const { mutate: assignUsers, isLoading } =
    api.group.assignUsers.useMutation();

  const utils = api.useContext();

  const onSubmit = () => {
    if (!selectedGroup) return;

    assignUsers(
      { group: selectedGroup, users: users.map((u) => u.id) },
      {
        async onSuccess() {
          await utils.user.list.invalidate();

          clearSelectedUsers();
          onClose();
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedGroup(Number(e.target.value));

  const [selectedGroup, setSelectedGroup] = useState<number | null>();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Users to Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={"column"} gap={5}>
            <Select placeholder="Select Group" onChange={handleChange}>
              {groups.data?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            colorScheme="teal"
            mr={3}
          >
            Assign
          </Button>
          <Button disabled={isLoading} onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignUsersToGroupForm;
