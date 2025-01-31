import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred'
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} maxW="500px" mx="auto" bg="red.100" borderRadius="lg" border="1px" borderColor="red.300">
          <VStack spacing={4}>
            <Heading color="red.600">{this.state.errorMessage.includes('Database') ? 'Database Connection Error' : 'Application Error'}</Heading>
            <Text color="red.700">{this.state.errorMessage}</Text>
            <Button
              colorScheme="red"
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary