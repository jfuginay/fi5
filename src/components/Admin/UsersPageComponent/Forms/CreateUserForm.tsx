import { api } from "~/utils/api";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Button,
  Flex,
  FormControl, FormErrorMessage, FormLabel, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";

const CreateUserForm = ({
                           isOpen,
                           onClose,
                         }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { mutate: createUser, isLoading } = api.user.create.useMutation();

  const utils = api.useContext();

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email"),
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
    createUser(data, {
      async onSuccess() {
        await utils.user.list.invalidate();

        onClose();
      },
      onError() {
        setError("email", {
          type: "custom",
          message: "A user with that email already exists",
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
        <ModalHeader>Add User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={"column"} gap={5}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" placeholder="..." {...register("name")} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="..." {...register("email")} />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
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

export default CreateUserForm;
