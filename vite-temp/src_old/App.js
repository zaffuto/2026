import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Layout/Navbar'

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Navbar />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App