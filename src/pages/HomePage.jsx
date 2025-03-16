import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import bookService from '../api/bookService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const data = await bookService.getAllBooks();
        setFeaturedBooks(data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los libros destacados:', err);
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random/1200x400/?library,books)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a nuestra Librería Online
          </Typography>

          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Descubre, compra y alquila los mejores libros desde la comodidad de tu hogar.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/books')}
            sx={{ mr: 2 }}
          >
            Ver catálogo
          </Button>

          {!currentUser && (
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </Button>
          )}
        </Container>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Libros destacados
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => navigate(`/books/${book.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.imageUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={book.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Autor: {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio: ${book.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/books')}
          >
            Ver todos los libros
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Sobre nosotros
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Somos una librería comprometida con fomentar la lectura y el conocimiento.
              Ofrecemos una amplia selección de libros de diferentes géneros y autores.
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestra plataforma te permite comprar libros físicos o alquilarlos por el tiempo que necesites,
              brindándote flexibilidad y comodidad en tu experiencia de lectura.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nuestros servicios
                </Typography>
                <Typography variant="body2" paragraph>
                  • Compra de libros con envío a domicilio
                </Typography>
                <Typography variant="body2" paragraph>
                  • Alquiler de libros por períodos flexibles
                </Typography>
                <Typography variant="body2" paragraph>
                  • Recomendaciones personalizadas
                </Typography>
                <Typography variant="body2" paragraph>
                  • Atención al cliente 24/7
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage; 