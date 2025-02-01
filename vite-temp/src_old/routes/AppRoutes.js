import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import CouponManager from '../components/Coupons/CouponManager'
import Dashboard from '../components/Dashboard/Dashboard'
import NotFound from '../components/common/NotFound'
import ErrorBoundary from '../components/common/ErrorBoundary'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/coupons" 
          element={
            <PrivateRoute>
              <CouponManager />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default AppRoutes