import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

const BookDetail = ({ book, open, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { addPurchaseToCart, addLoanToCart } = useCart();
  const { showNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState('purchase'); // 'purchase' o 'rent'

  const handleAction = async () => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesión para realizar esta acción', 'warning');
      return;
    }

    try {
      if (mode === 'purchase') {
        addPurchaseToCart(book, quantity);
        showNotification('Libro agregado al carrito', 'success');
      } else {
        addLoanToCart(book);
        showNotification('Alquiler agregado al carrito', 'success');
      }
      onClose();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{book.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Autor: {book.author}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Modo</InputLabel>
                <Select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  label="Modo"
                >
                  <MenuItem value="purchase">Comprar</MenuItem>
                  <MenuItem value="rent">Alquilar</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {mode === 'purchase' ? (
            <>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Precio: ${book.price}
                </Typography>
                <TextField
                  type="number"
                  label="Cantidad"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), book.stock))}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 1, max: book.stock }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Total: ${(book.price * quantity).toFixed(2)}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Precio de renta mensual: ${book.rentalPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  El alquiler tiene una duración de 1 mes
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleAction}
          variant="contained"
          color="primary"
          disabled={!isAuthenticated || book.stock === 0}
        >
          {mode === 'purchase' ? 'Comprar' : 'Alquilar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookDetail; 