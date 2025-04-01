import React, { useState } from "react";

import { useRouter } from "next/router";
import { api } from "~/utils/api";
import {
  Box,
  Center,
  Stack,
  Text,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import VisitLogCard from "./partial/VisitLogCard";
import type { Address } from "@prisma/client";
import { LogVisitModal } from "~/components/Global/LogVisitModal";

const AddressDetailsPageComponent = () => {
  const router = useRouter();

  const { addressId } = router.query;

  const address = api.address.findById.useQuery({
    addressId: Number(addressId),
  }, {enabled: !!addressId});

  const utils = api.useContext();

  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const {
    isOpen: isLogModalOpen,
    onOpen: openLogModal,
    onClose: closeLogModal,
  } = useDisclosure();

  const handleOpenLogModal = (address: Address) => {
    setSelectedAddress(address);
    openLogModal();
  };

  const handleLogModalSuccess = () => {
    void utils.address.list.refetch();

    closeLogModal();
  };

  return (
    <Box p={5}>
      <Stack spacing={3}>
        {address.data?.visits.length === 0 ? (
          <Center h={"80vh"}>
            <Text fontSize={"3xl"}>No logs available</Text>
          </Center>
        ) : (
          <>
            {address.data && (
              <Flex justifyContent={"right"}>
                <Button
                  onClick={() => handleOpenLogModal(address.data!)}
                  colorScheme={"blue"}
                  w={200}
                >
                  Log Visit
                </Button>
              </Flex>
            )}
            {address.data?.visits.map((visit, key) => (
              <VisitLogCard key={key} visit={visit} />
            ))}
          </>
        )}
      </Stack>

      <LogVisitModal
        isOpen={isLogModalOpen}
        onClose={closeLogModal}
        addressId={selectedAddress?.id}
        onSuccess={handleLogModalSuccess}
      />
    </Box>
  );
};

export default AddressDetailsPageComponent;
