import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  TableContainer,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Select, Tooltip,
} from "@chakra-ui/react";
import { Address } from "@prisma/client";
import { api } from "~/utils/api";
import React, { useState} from "react";
import {StatusColors, StatusNames} from "~/common/status";

const AssignAddressesModal = ({
  isOpen,
  onClose,
  addresses,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSuccess: () => void;
}) => {
  const groupsQuery = api.group.all.useQuery()

  const { mutate: assignAddresses } = api.group.assignAddresses.useMutation();

  const [selectedGroup, setSelectedGroup] = useState<number>();

  const handleAssignClick = () => {
    if (!selectedGroup) return;

    assignAddresses(
      {
        addresses: addresses.map((a) => a.id),
        group: Number(selectedGroup),
      },
      {
        onSuccess,
      }
    );
  };

  return (
    <Modal
      scrollBehavior={"inside"}
      size={"3xl"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Status</Th>
                  <Th>Street</Th>
                </Tr>
              </Thead>
              <Tbody>
                {addresses.map((a) => (
                  <Tr key={a.id}>
                    <Td>
                      <Tooltip label={StatusNames[a.status]}>
                        <svg
                            height={20}
                            viewBox="0 0 24 24"
                            className={"cursor-pointer stroke-none "}
                        >
                          <circle
                              cx="10"
                              cy="10"
                              r="9"
                              stroke={"black"}
                              strokeWidth="1"
                              fill={StatusColors[a.status]}
                          />
                        </svg>
                      </Tooltip>
                    </Td>
                    <Td>{a.street}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter gap={2}>
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(Number(e.currentTarget.value))}
          >
            <option selected hidden disabled>Select Group</option>
            {groupsQuery.data?.map((g) => (
              <option key={Number(g.id)} value={Number(g.id)}>
                {g.name}
              </option>
            ))}
          </Select>
          <Button
            isDisabled={!selectedGroup}
            colorScheme="blue"
            mr={3}
            pl={10}
            pr={10}
            onClick={handleAssignClick}
          >
            Assign {addresses.length} { addresses.length > 1 ? 'addresses': 'address' }
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignAddressesModal;
