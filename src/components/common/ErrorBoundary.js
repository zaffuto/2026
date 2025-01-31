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
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} maxW="500px" mx="auto">
          <VStack spacing={4}>
            <Heading>Oops! Something went wrong.</Heading>
            <Text>We apologize for the inconvenience.</Text>
            <Button
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