import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import BillsPage from './pages/BillsPage';
import AdminPage from './pages/AdminPage';
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  width: '100%',
                  overflowX: 'hidden'
                }}
              >
                <Navbar />
                <Container component="main"
                  disableGutters
                  sx={{
                    flex: 1,
                    width: '100%',
                    py: 4,
                    px: 2,
                    maxWidth: '100%'
                  }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/:id" element={<BookDetailPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/bills" element={<BillsPage />} />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>
                  </Routes>
                </Container>
                <Footer />
              </Box>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 