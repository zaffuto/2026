import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box maxW="500px" mx="auto" mt={16} p={4}>
      <VStack spacing={6}>
        <Heading size="2xl">404</Heading>
        <Heading size="md">Page Not Found</Heading>
        <Text textAlign="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </VStack>
    </Box>
  )
}

export default NotFound