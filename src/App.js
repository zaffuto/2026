import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import CouponManager from './components/Coupons/CouponManager'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/coupons" element={<CouponManager />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App