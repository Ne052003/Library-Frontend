import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import BookCard from '../components/books/BookCard';
import BookDetail from '../components/books/BookDetail';
import bookService from '../api/bookService';
import { useNotification } from '../context/NotificationContext';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los libros');
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handlePurchase = async (quantity) => {
    try {
      await bookService.purchaseBook(selectedBook.id, quantity);
      showNotification('Compra realizada con éxito', 'success');
      fetchBooks();
    } catch (error) {
      showNotification('Error al realizar la compra', 'error');
    }
  };

  const handleRent = async () => {
    try {
      await bookService.rentBook(selectedBook.id);
      showNotification('Alquiler realizado con éxito', 'success');
      fetchBooks();
    } catch (error) {
      showNotification('Error al realizar el alquiler', 'error');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catálogo de Libros
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3} sx={{
        width: '100%',
        margin: '0 auto',
        px: { xs: 0, sm: 0 }
      }}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id} >
            <BookCard
              book={book}
              onBookClick={handleBookClick}
            />
          </Grid>
        ))}
      </Grid>

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          open={Boolean(selectedBook)}
          onClose={() => setSelectedBook(null)}
          onPurchase={handlePurchase}
          onRent={handleRent}
        />
      )}
    </Box>
  );
};

export default BooksPage;