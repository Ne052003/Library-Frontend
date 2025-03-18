import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import libraryicon from '../assets/libraryicon.jpg'
import { useAuth } from '../context/AuthContext';
import bookService from '../api/bookService';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openRentDialog, setOpenRentDialog] = useState(false);
  const [rentDays, setRentDays] = useState(7);
  const [purchaseConfirmOpen, setPurchaseConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del libro. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const result = await bookService.purchaseBook(id);
      setSuccessMessage(`¡Compra exitosa! Número de factura: ${result.billId}`);
      setPurchaseConfirmOpen(false);
      setBook({ ...book, available: false });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la compra. Por favor, intenta de nuevo.');
      setPurchaseConfirmOpen(false);
    }
  };

  const handleRent = async () => {
    try {
      const result = await bookService.rentBook(id, { days: rentDays });
      setSuccessMessage(`¡Alquiler exitoso! Número de factura: ${result.billId}`);
      setOpenRentDialog(false);
      setBook({ ...book, available: false });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar el alquiler. Por favor, intenta de nuevo.');
      setOpenRentDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !book) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/books')}
        >
          Volver al catálogo
        </Button>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">No se encontró el libro solicitado.</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/books')}
        >
          Volver al catálogo
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="outlined"
        onClick={() => navigate('/books')}
        sx={{ mb: 3 }}
      >
        ← Volver al catálogo
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={book.imageUrl || libraryicon}
              alt={book.title}
              sx={{ height: 450 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {book.title}
              </Typography>

              <Typography variant="h6" color="text.secondary" gutterBottom>
                por {book.author}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {book.description || 'No hay descripción disponible para este libro.'}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Detalles:
                </Typography>

                <Grid container spacing={2}>

                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Año de publicación:</strong> {book.publishYear || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Género:</strong> {book.genre || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Páginas:</strong> {book.pages || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${book.price}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    ml: 2,
                    backgroundColor: book.stock > 0 ? 'success.light' : 'error.light',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  {book.stock > 0 ? 'Disponible' : 'No disponible'}
                </Typography>
              </Box>

              {isAuthenticated && book.available && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setPurchaseConfirmOpen(true)}
                    fullWidth
                  >
                    Comprar
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => setOpenRentDialog(true)}
                    fullWidth
                  >
                    Alquilar
                  </Button>
                </Box>
              )}

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Debes iniciar sesión para comprar o alquilar este libro.
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => navigate('/login')}
                    sx={{ ml: 2 }}
                  >
                    Iniciar sesión
                  </Button>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={purchaseConfirmOpen}
        onClose={() => setPurchaseConfirmOpen(false)}
      >
        <DialogTitle>Confirmar compra</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas comprar "{book.title}" por ${book.price}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handlePurchase} variant="contained" color="primary">
            Confirmar compra
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRentDialog}
        onClose={() => setOpenRentDialog(false)}
      >
        <DialogTitle>Alquilar libro</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Estás a punto de alquilar "{book.title}".
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="rent-days-label">Días de alquiler</InputLabel>
            <Select
              labelId="rent-days-label"
              value={rentDays}
              label="Días de alquiler"
              onChange={(e) => setRentDays(e.target.value)}
            >
              <MenuItem value={3}>3 días</MenuItem>
              <MenuItem value={7}>7 días</MenuItem>
              <MenuItem value={14}>14 días</MenuItem>
              <MenuItem value={30}>30 días</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Precio total: ${(book.price * 0.1 * rentDays).toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (10% del precio por día)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRentDialog(false)}>Cancelar</Button>
          <Button onClick={handleRent} variant="contained" color="primary">
            Confirmar alquiler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDetailPage; 