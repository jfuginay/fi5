import { api } from "~/utils/api";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { User, UserRole } from "@prisma/client";
import {AddressWithVisits} from "~/types";


const roles = [UserRole.user, UserRole.admin]

const EditUserForm = ({
  isOpen,
  onClose,
  user,
  onSuccess
}: {

  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}) => {
  const groups = api.group.all.useQuery();

  const { mutate: editUser, isLoading } = api.user.update.useMutation();

  const utils = api.useContext();

  const formSchema = z.object({
    name: z.string().nonempty("Required"),
    role: z.enum([UserRole.user, UserRole.admin]),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    editUser({
      id: user.id,
      name: data.name,
      role: data.role,
    }, {
      onSuccess
    });
  };

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={"column"} gap={5}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                defaultValue={user.name || undefined}
                id="name"
                placeholder="..."
                {...register("name")}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.role}>
              <FormLabel htmlFor="role">role</FormLabel>
              <Select
                defaultValue={user.role || undefined}
                id={"role"}
                {...register("role")}
              >
                {roles.map((role) => (
                  <option className={"capitalize"} key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.role && errors.role.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleSubmit(onSubmit)} colorScheme="teal" mr={3}>
            Submit
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserForm;
