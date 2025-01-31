import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import theme from './theme/theme';
import AppRoutes from './routes/AppRoutes';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Analytics />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);