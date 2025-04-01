import { useForm, type SubmitHandler } from "react-hook-form";

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Center,
  Container,
  Flex,
} from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";

import { Loading } from "~/components/Global/Loading";

const AccountPageComponent = () => {
  const currentUser = api.user.current.useQuery();
  const updateCurrentUser = api.user.updateCurrent.useMutation();

  const formSchema = z.object({
    name: z.string().min(1, "Required").max(100, "Invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    updateCurrentUser.mutate(data, {
      onSuccess() {
        reset(data)
      }
    });
  };

  if (currentUser.isLoading) {
    return (
      <Center h={"90vh"}>
        <Loading />
      </Center>
    );
  }

  return (
    <Center h={"80vh"}>
      <Container>
          <Flex direction={"column"} gap={5}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="name"
                defaultValue={currentUser.data?.name || undefined}
                {...register("name")}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                defaultValue={currentUser.data?.email || undefined}
                placeholder="email"
                disabled
              />
            </FormControl>
            <Button
              isDisabled={!isDirty || updateCurrentUser.isLoading}
              onClick={handleSubmit(onSubmit)}
              colorScheme="teal"
            >
              Update
            </Button>
          </Flex>
      </Container>
    </Center>
  );
};

export default AccountPageComponent;
