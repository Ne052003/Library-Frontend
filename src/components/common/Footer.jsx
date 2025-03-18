import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Librería Online
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu destino para comprar y alquilar los mejores libros.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces rápidos
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Inicio
            </Link>
            <Link href="/books" color="inherit" display="block" sx={{ mb: 1 }}>
              Catálogo
            </Link>
            <Link href="/profile" color="inherit" display="block" sx={{ mb: 1 }}>
              Mi cuenta
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: alxism16@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: (294) 6645
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Librería Online. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 