import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../../config/supabaseClient'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      
      toast({
        title: 'Success',
        description: 'Registration successful! Please check your email for verification.',
        status: 'success',
        duration: 5000,
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="400px" mx="auto" mt={8} p={4}>
      <VStack spacing={6}>
        <Heading>Create Account</Heading>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Button 
          colorScheme="green" 
          onClick={handleRegister} 
          width="100%"
          isLoading={loading}
        >
          Register
        </Button>
        <Text>
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="green.500">
            Login here
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default Register