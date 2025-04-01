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
  ModalOverlay, Select, useToast
} from "@chakra-ui/react";
import states from "~/common/states";

const CreateAddressForm = ({
                           isOpen,
                           onClose,
                         }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const groups = api.group.all.useQuery();

  const { mutate: createLocation, isLoading } = api.address.create.useMutation();

  const utils = api.useContext();

  const formSchema = z.object({
    street: z.string().min(1, "Address is required").max(30, "Invalid"),
    unit: z.string().nullable(),
    city: z.string().min(1, "City is required").max(30, "Invalid"),
    state: z.string().min(1, "State is required").max(30, "Invalid"),
    group: z.number().nullable()
  });

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: 'Spokane',
      state: 'Washington'
    }
  });

  const toast = useToast()

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    createLocation(data, {
      async onSuccess() {
       await utils.address.list.invalidate()
       onClose()
      },

      onError(e) {
        if (e.data?.code === 'BAD_REQUEST') {
          toast({
            position: 'top',
            title: e.message,
            status: 'error',
            duration: 3000,
          })
        }
      }
    })
  };

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Address</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={"column"} gap={5}>
            <FormControl isInvalid={!!errors.street}>
              <FormLabel htmlFor="street">Street</FormLabel>
              <Input id="street" placeholder="..." {...register("street")} />
              <FormErrorMessage>
                {errors.street && errors.street.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.unit}>
              <FormLabel htmlFor="unit">Unit</FormLabel>
              <Input id="unit" placeholder="ex. Apt 57 or 57" {...register("unit")} />
              <FormErrorMessage>
                {errors.unit && errors.unit.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.city}>
              <FormLabel htmlFor="city">City</FormLabel>
              <Input id="city" placeholder="..." {...register("city")} />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.state}>
              <FormLabel htmlFor='state'>State</FormLabel>
              <Select defaultValue={undefined} {...register('state')} >
                {states.map((state, idx) => (
                  <option key={idx} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.state && errors.state.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.group}>
              <FormLabel htmlFor='group'>Group</FormLabel>
              <Select defaultValue={undefined} {...register('group')} >
                {groups.data?.map((group) => (
                  <option key={Number(group.id)} value={Number(group.id)}>
                    {group.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.group && errors.group.message}
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

export default CreateAddressForm;
