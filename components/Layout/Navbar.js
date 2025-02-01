import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box bg="white" boxShadow="sm" px={4} py={3}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <HStack spacing={8}>
          <Heading size="md" color="green.500" cursor="pointer" onClick={() => navigate('/')}>
            Ecocupon
          </Heading>
          {user && (
            <HStack spacing={4}>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                How it works
              </Button>
              <Button variant="ghost" onClick={() => navigate('/coupons')}>
                Stores
              </Button>
            </HStack>
          )}
        </HStack>

        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={SearchIcon} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search coupons by store"
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
            />
          </InputGroup>

          {user ? (
            <Button
              variant="outline"
              colorScheme="green"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <HStack spacing={4}>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                colorScheme="green"
                onClick={() => navigate('/register')}
              >
                Get started
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar