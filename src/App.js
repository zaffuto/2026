import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Layout/Navbar'

const App = () => {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  )
}

export default App