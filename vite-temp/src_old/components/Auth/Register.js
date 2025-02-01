import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../../config/supabaseClient'
import { validateEmail, validatePassword, sanitizeInput } from '../../utils/validation'
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
  FormErrorMessage,
} from '@chakra-ui/react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const toast = useToast()

  const validateForm = () => {
    const newErrors = {}
    
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const sanitizedEmail = sanitizeInput(email)
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
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
        <FormControl isRequired isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.password}>
          <FormLabel>Password</FormLabel>
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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