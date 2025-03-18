import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

const Navbar = () => {
  const { isAuthenticated, logout, userRole } = useAuth();
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemCount = cartItems.purchases.length + cartItems.loans.length;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
              NeoLibrary
            </RouterLink>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/books">
              Libros
            </Button>

            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Mi Perfil
                </Button>

                <Button color="inherit" component={RouterLink} to="/bills">
                  Mis Facturas
                </Button>

                {userRole === 'ADMIN' && (
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Admin
                  </Button>
                )}

                <Button color="inherit" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Iniciar Sesión
                </Button>

                <Button color="inherit" component={RouterLink} to="/register">
                  Registrarse
                </Button>
              </>
            )}
          </Box>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{ ml: 2 }}
              aria-label="Shopping cart"
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default Navbar; 