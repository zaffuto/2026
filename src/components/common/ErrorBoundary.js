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
    this.state = { hasError: false, errorMessage: '', errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred'
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    this.setState({ errorInfo })

    // Here you could add error reporting service integration
    // Example: Sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.errorMessage.toLowerCase()
      const isDbError = errorMessage.includes('database')
      const isConfigError = errorMessage.includes('configuration')
      const errorTitle = isConfigError ? 'Configuration Error' : isDbError ? 'Database Connection Error' : 'Application Error'
      
      return (
        <Box p={8} maxW="500px" mx="auto" bg="red.100" borderRadius="lg" border="1px" borderColor="red.300">
          <VStack spacing={4}>
            <Heading color="red.600">{errorTitle}</Heading>
            <Text color="red.700">{this.state.errorMessage}</Text>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Text as="pre" fontSize="sm" p={4} bg="red.50" borderRadius="md" whiteSpace="pre-wrap">
                {this.state.errorInfo.componentStack}
              </Text>
            )}
            <Button
              colorScheme="red"
              onClick={() => {
                this.setState({ hasError: false, errorInfo: null })
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