import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import transactionService from '../../api/transactionService';

const CartDrawer = ({ open, onClose }) => {
  const { cartItems, removeFromCart, clearCart, getTotalAmount } = useCart();
  const { showNotification } = useNotification();

  const formatPrice = (price) => Number(price).toFixed(2);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDueDate = () => {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    return dueDate;
  }

  const handleCheckout = async () => {
    try {
      const result = await transactionService.processTransaction(cartItems);
      showNotification('Transacción completada con éxito', 'success');
      clearCart();
      onClose();
    } catch (error) {
      showNotification(
        'Error al procesar la transacción: ' + error.message,
        'error'
      );
    }
  };

  return (
    <Drawer anchor="right"
      open={open}
      onClose={onClose}
      keepMounted
      SlideProps={{
        tabIndex: -1
      }} PaperProps={{
        sx: {
          maxWidth: '100vw',
          width: { xs: '100%', sm: 350 }
        }
      }}>
      <Box sx={{
        width: '100%',
        p: 2,
        overflow: 'auto'
      }} role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart">
        <Typography variant="h6" gutterBottom>
          Carrito de Compras
        </Typography>

        {cartItems.purchases.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Compras
            </Typography>
            <List>
              {cartItems.purchases.map((item) => (
                <ListItem key={`purchase-${item.bookId}`}>
                  <ListItemText
                    primary={item.book.title}
                    secondary={`Cantidad: ${item.quantity} - $${formatPrice(item.book.price * item.quantity)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFromCart('purchases', item.bookId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}

        {cartItems.loans.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Alquileres
            </Typography>
            <List>
              {cartItems.loans.map((item) => (
                <ListItem key={`loan-${item.book.id}`}>
                  <ListItemText
                    primary={item.book.title}
                    secondary={<>
                      <div>Alquiler mensual - ${formatPrice(item.book.rentalPrice)}</div>
                      <div>Vence: {formatDate(calculateDueDate())}</div>
                    </>}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFromCart('loans', item.book.id)}
                      aria-label={`Remove ${item.book.title} from cart`}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">
          Total: ${getTotalAmount()}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={clearCart}
            fullWidth
            aria-label="Clear cart"
          >
            Vaciar Carrito
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            fullWidth
            disabled={cartItems.purchases.length === 0 && cartItems.loans.length === 0}
            aria-label="Proceed to checkout"
          >
            Pagar
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 