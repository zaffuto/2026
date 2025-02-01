import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { supabase } from '../../config/supabaseClient'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '', errorInfo: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred'
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    this.setState({ errorInfo })

    // Add error reporting service integration here if needed
    // Example: Sentry.captureException(error)
  }

  handleRetry = async () => {
    const { retryCount } = this.state
    
    if (this.state.errorMessage.toLowerCase().includes('database')) {
      try {
        // Test database connection
        await supabase.from('health_check').select('*').limit(1)
        this.setState({ hasError: false, errorInfo: null, retryCount: 0 })
        window.location.reload()
      } catch (error) {
        this.setState({ 
          retryCount: retryCount + 1,
          errorMessage: retryCount >= 2 ? 
            'Multiple connection attempts failed. Please try again later.' : 
            'Retrying database connection...'
        })
      }
    } else {
      this.setState({ hasError: false, errorInfo: null, retryCount: 0 })
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.errorMessage.toLowerCase()
      const isDbError = errorMessage.includes('database')
      const isConfigError = errorMessage.includes('configuration')
      const errorTitle = isConfigError ? 'Configuration Error' : 
                        isDbError ? 'Database Connection Error' : 
                        'Application Error'
      
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
            <HStack spacing={4}>
              <Button
                colorScheme="red"
                onClick={this.handleRetry}
                isLoading={this.state.retryCount > 0 && this.state.retryCount < 3}
                loadingText="Retrying"
              >
                {this.state.retryCount >= 3 ? 'Try Again Later' : 'Try Again'}
              </Button>
              {isDbError && this.state.retryCount >= 3 && (
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => window.location.href = '/'}
                >
                  Return Home
                </Button>
              )}
            </HStack>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary