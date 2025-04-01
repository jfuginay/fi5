import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Td,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { z } from "zod";
import { api } from "~/utils/api";
import React, { useEffect, useState } from "react";
import truncate from "~/utils/truncate";
import { QRCodeSVG } from "qrcode.react";
import { AttachmentIcon, EditIcon } from "@chakra-ui/icons";

import { BsQrCodeScan } from "react-icons/bs";

const GroupsPageComponent = () => {
  const groups = api.group.all.useQuery();

  const [qrCode, setQrCode] = useState<string>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isQrCodeOpen,
    onOpen: openQrCode,
    onClose: closeQrCode,
  } = useDisclosure();

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
          Groups
        </Text>
        <Button
          onClick={onOpen}
          leftIcon={<MdAdd fontSize={22} />}
          colorScheme="teal"
        >
          Add
        </Button>
      </Flex>

      <CreateGroupModal isOpen={isOpen} onClose={onClose} />
      <QrCodeModal isOpen={isQrCodeOpen} onClose={closeQrCode} url={qrCode} />

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Group name</Th>
              <Th>Code</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.data?.map((group) => (
              <Tr key={group.id}>
                <Td>
                  <Checkbox colorScheme={"teal"} />
                </Td>
                <Td>{truncate(group.name, 50)}</Td>

                <Td>
                  <IconButton
                    variant={"unstyled"}
                    aria-label={"Edit"}
                    icon={<AttachmentIcon />}
                    onClick={() => {
                      const code = `${window.location.origin}/groups/join/${group.id}`;
                      setQrCode(code);
                      openQrCode();
                    }}
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

// Import useSession from NextAuth.js
import { useSession, signIn } from "next-auth/react";

const QrCodeModal = ({
                       isOpen,
                       onClose,
                       url,
                     }: {
  isOpen: boolean;
  onClose: () => void;
  url: string | undefined;
}) => {
  const { data: session } = useSession(); // Get the current session
  const toast = useToast();

  const handleQrClick = async () => {
    if (session) {
      // User is logged in, proceed with your logic
      try {
        await navigator.clipboard.writeText(url!);
        toast({
          title: "Copied link to clipboard",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error copying link to clipboard", error);
      }
    } else {
      // No user session found, redirect to sign-in
      await signIn(); // Redirects the user to sign in
    }
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            {url && (
                <QRCodeSVG
                    cursor={'pointer'}
                    onClick={handleQrClick}
                    value={url}
                    width={"100%"}
                    height={"100%"}
                />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

const CreateGroupModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { mutate: createGroup, isLoading } = api.group.create.useMutation();

  const utils = api.useContext();

  const formSchema = z.object({
    name: z
      .string()
      .min(4, "Name must be greater than 3 characters")
      .max(50, "Name is too long"),
  });

  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    createGroup(data, {
      async onSuccess() {
        await utils.group.all.refetch();
        onClose();
      },
      onError() {
        setError("name", {
          type: "custom",
          message: "A group with that name already exists",
        });
      },
    });
  };

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Assignment Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Group name</FormLabel>
            <Input id="name" placeholder="..." {...register("name")} />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}
            colorScheme="teal"
            mr={3}
          >
            Create
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupsPageComponent;
