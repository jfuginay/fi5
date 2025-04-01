import {AddressWithGroupsAndVisits, AddressWithVisits} from "~/types";
import {api} from "~/utils/api";
import {Address, VisitStatus} from "@prisma/client";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Button,
    Checkbox,
    Flex,
    FormControl, FormErrorMessage, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select, Textarea
} from "@chakra-ui/react";

import {StatusDropdownOptions} from "~/common/status";

const LogVisitModal = ({
                           isOpen,
                           onClose,
                           addressId,
                           onSuccess
                       }: {
    isOpen: boolean;
    onClose: () => void;
    addressId: number | null | undefined;
    onSuccess: (address: Address | null) => void;
}) => {
    const { mutate: logVisit, isLoading } = api.address.logVisit.useMutation();

    const address = api.address.findById.useQuery(
        { addressId: addressId! },
        {
            enabled: !!addressId,
            onSuccess(address: Address) {
                resetForm({
                    name: address.name || "",
                    contact: address.contact || "",
                    status: address.status,
                    childrenK5InHome: address.childrenK5InHome || false,
                    notes: address.notes || "",
                    prayerRequest: address.prayerRequest || "",
                });
            },
        }
    );

    const formSchema = z.object({
        name: z.string(),
        contact: z.string(),
        status: z.enum([
            VisitStatus.u,
            VisitStatus.a,
            VisitStatus.v,
            VisitStatus.f,
            VisitStatus.fu,
            VisitStatus.fc,
            VisitStatus.dnv,
            VisitStatus.pr,
        ]),
        childrenK5InHome: z.boolean(),
        notes: z.string(),
        prayerRequest: z.string(),
    });

    const {
        register,
        handleSubmit,
        reset: resetForm,
        formState: { errors, isDirty },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (visit) => {
        logVisit(
            { addressId: addressId!, ...visit },
            {
                onSuccess(address: Address) {
                    onSuccess(address)
                },
            }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{address.data?.street}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction={"column"} gap={5}>
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Name(s)</FormLabel>
                            <Input id="name" {...register("name")} />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.contact}>
                            <FormLabel htmlFor="contact">Email or mobile number</FormLabel>
                            <Input id="contact" {...register("contact")} />
                            <FormErrorMessage>
                                {errors.contact && errors.contact.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.status}>
                            <FormLabel htmlFor="status">Status</FormLabel>
                            <Select {...register("status")}>
                                {Object.entries(StatusDropdownOptions).map((status, key) => (
                                    <option key={key} value={status[0]}>
                                        {status[1]}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                                {errors.status && errors.status.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.childrenK5InHome}>
                            <Checkbox size={"lg"} id="childenK5InHome" {...register("childrenK5InHome")}>
                                Children K-5 in the home
                            </Checkbox>
                            <FormErrorMessage>
                                {errors.childrenK5InHome && errors.childrenK5InHome.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.notes}>
                            <FormLabel htmlFor="notes">Notes & Followup</FormLabel>
                            <Textarea id="notes" {...register("notes")} />
                            <FormErrorMessage>
                                {errors.notes && errors.notes.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.prayerRequest}>
                            <FormLabel htmlFor="prayerRequest">Prayer Request</FormLabel>
                            <Textarea id="notes" {...register("prayerRequest")} />
                            <FormErrorMessage>
                                {errors.prayerRequest && errors.prayerRequest.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        isDisabled={!isDirty || isLoading || address.isLoading}
                        onClick={handleSubmit(onSubmit)}
                        colorScheme="blue"
                    >
                        SUBMIT
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogVisitModal
