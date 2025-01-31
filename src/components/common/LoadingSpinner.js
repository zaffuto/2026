import { Center, Spinner } from '@chakra-ui/react'

const LoadingSpinner = () => {
  return (
    <Center h="200px">
      <Spinner 
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.500"
        size="xl"
      />
    </Center>
  )
}

export default LoadingSpinner