import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import libraryicon from '../../assets/libraryicon.jpg';

const BookCard = ({ book, onBookClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={book.imageUrl || libraryicon}
        alt={book.title}
      />
      <CardContent sx={{
        flexGrow: 1, p: 2,
        '&:last-child': { pb: 2 }
      }}>
        <Typography gutterBottom variant="h5" component="h2">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Autor: {book.author}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Precio de compra: ${book.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precio de alquiler: ${book.rentalPrice}
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Chip
            label={`Stock: ${book.stock}`}
            color={book.stock > 0 ? "success" : "error"}
            size="small"
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onBookClick(book)}
          disabled={book.stock === 0}
        >
          {book.stock > 0 ? 'Ver detalles' : 'Sin stock'}
        </Button>
      </Box>
    </Card>
  );
};

export default BookCard;