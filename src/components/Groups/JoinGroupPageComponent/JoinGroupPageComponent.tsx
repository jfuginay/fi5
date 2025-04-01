import {Button, Center, Flex, Text} from "@chakra-ui/react";
import {api} from "~/utils/api";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

const JoinGroupPageComponent = () => {
    const session = useSession()

    const utils = api.useContext();

    const router = useRouter();

    const { groupId } = router.query;

    const { mutate: changeGroup, isSuccess } =
        api.user.changeCurrentGroup.useMutation();

    const group = api.group.findById.useQuery(Number(groupId), {
        enabled: !!groupId,
    });

    if (group.isLoading) {
        return <h1>Loading..</h1>;
    }

    if (group.isError) {
        return <h1>Error</h1>;
    }

   return (
       <Center h={"85vh"}>
           {isSuccess ? (
               <Flex
                   direction={"column"}
                   justifyContent={"center"}
                   alignItems={"center"}
                   gap={5}
               >
                   <Text
                       align={"center"}
                       as={"b"}
                       fontSize={{ md: "5xl", base: "5xl" }}
                       color={"blue.400"}
                   >
                       Success! <br /> You can now view addresses that have been assigned
                       to this group
                   </Text>

                   <Button
                       onClick={() => {
                           void router.push("/admin/map-view");
                       }}
                       colorScheme={"blue"}
                       size={"lg"}
                       width={"40%"}
                   >
                       View Map
                   </Button>
               </Flex>
           ) : (
               <Flex
                   direction={"column"}
                   justifyContent={"center"}
                   alignItems={"center"}
                   gap={4}
               >
                   <Text
                       align={"center"}
                       as={"b"}
                       fontSize={{ md: "7xl", base: "5xl" }}
                       color={"blue.400"}
                   >
                       You have been invited to join <br />{" "}
                       <Text fontSize={{ md: "6xl", base: "5xl" }} color={"teal.400"}>
                           {group.data.name}
                       </Text>
                   </Text>

                   <Button
                       onClick={() => {
                           changeGroup(
                               { group: group.data.id },
                               {
                                   onSuccess() {
                                       void utils.user.current.invalidate();

                                       if (session.data) {
                                           session.data.user.groupId = group.data.id
                                       }
                                   },
                               }
                           );
                       }}
                       colorScheme={"blue"}
                       size={"lg"}
                       width={"60%"}
                   >
                       Accept
                   </Button>
               </Flex>
           )}
       </Center>
   )
}

export default JoinGroupPageComponent
