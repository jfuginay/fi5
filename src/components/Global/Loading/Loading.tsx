import { Spinner } from "@chakra-ui/react"

const Loading = () => {
 return (
   <Spinner
     thickness="4px"
     speed="0.65s"
     emptyColor="teal.400"
     color=""
     size="xl"
   />
 )
}

export default Loading
