import * as React from "react";
import { type Address } from "@prisma/client";
import { api } from "~/utils/api";
import { useState } from "react";
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

const AssignAddressesToGroup = ({
  isOpen,
  onClose,
  addresses,
  clearSelectedAddresses,
}: {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  clearSelectedAddresses: () => void;
}) => {
  const groups = api.group.all.useQuery();

  const { mutate: assignAddresses, isLoading } =
    api.group.assignAddresses.useMutation();

  const utils = api.useContext();

  const onSubmit = () => {
    if (!selectedGroup) return;

    assignAddresses(
      {
        group: selectedGroup,
        addresses: addresses.map(a => a.id),
      },
      {
        async onSuccess() {
          await utils.address.list.invalidate();
          clearSelectedAddresses();
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

export default AssignAddressesToGroup;
