import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import bookService from '../api/bookService';
import userService from '../api/userService';
import billService from '../api/billService';
import BillDetailDialog from '../components/bills/BillDetailDialog';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetailOpen, setBillDetailOpen] = useState(false);

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedBookDescription, setSelectedBookDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (tabValue === 0) {
          const booksData = await bookService.getAllBooks();
          setBooks(booksData);
        } else if (tabValue === 1) {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
        } else if (tabValue === 2) {
          const billsData = await billService.getAllBills();
          setBills(billsData);
        }

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenBookDialog = (book = null) => {
    setSelectedBook(book);
    setOpenBookDialog(true);
  };

  const handleCloseBookDialog = () => {
    setOpenBookDialog(false);
    setSelectedBook(null);
  };

  const handleViewBillDetails = async (billId) => {
    try {
      const billDetails = await billService.getBillById(billId);
      setSelectedBill(billDetails);
      setBillDetailOpen(true);
    } catch (err) {
      setError('Error al cargar los detalles de la factura');
    }
  };

  const handleDeleteConfirm = (type, item) => {
    setItemToDelete({ type, item });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete.type === 'book') {

        await bookService.deleteBook(itemToDelete.item.id);
        setBooks(books.filter(book => book.id !== itemToDelete.item.id));
        setSuccessMessage('Libro eliminado correctamente');
      } else if (itemToDelete.type === 'user') {

        await userService.deleteUser(itemToDelete.item.id);
        setUsers(users.filter(user => user.id !== itemToDelete.item.id));
        setSuccessMessage('Usuario eliminado correctamente');
      }

      setDeleteConfirmOpen(false);
      setItemToDelete(null);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Error al eliminar el elemento. Por favor, intenta de nuevo.');
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDescription = (description) => {
    setSelectedBookDescription(description);
    setDescriptionDialogOpen(true);
  };

  const handleCloseDescriptionDialog = () => {
    setDescriptionDialogOpen(false);
  };

  const bookValidationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    author: Yup.string().required('El autor es requerido'),
    price: Yup.number()
      .positive('El precio debe ser positivo')
      .required('El precio es requerido'),
    rentalPrice: Yup.number()
      .positive('El precio de alquiler debe ser positivo')
      .required('El precio de alquiler es requerido'),
    stock: Yup.number()
      .integer('El stock debe ser un número entero')
      .min(0, 'El stock no puede ser negativo')
      .required('El stock es requerido'),
    description: Yup.string()
  });

  const bookFormik = useFormik({
    initialValues: {
      title: selectedBook?.title || '',
      author: selectedBook?.author || '',
      price: selectedBook?.price || '',
      rentalPrice: selectedBook?.rentalPrice || '',
      stock: selectedBook?.stock || 0,
      description: selectedBook?.description || '',
      imageUrl: selectedBook?.imageUrl || ''
    },
    enableReinitialize: true,
    validationSchema: bookValidationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedBook) {
          const updatedBook = await bookService.updateBook(selectedBook.id, values);
          const updatedBooks = books.map(book =>
            book.id === selectedBook.id ? updatedBook : book
          );
          setBooks(updatedBooks);
          setSuccessMessage('Libro actualizado correctamente');
        } else {
          const newBook = await bookService.createBook(values);
          setBooks([...books, newBook]);
          setSuccessMessage('Libro creado correctamente');
        }

        handleCloseBookDialog();

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Error al guardar el libro. Por favor, intenta de nuevo.'
        );
      }
    }
  });

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Administración
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Libros" />
          <Tab label="Usuarios" />
          <Tab label="Facturas" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Gestión de Libros
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenBookDialog()}
                  >
                    Nuevo Libro
                  </Button>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Título</strong></TableCell>
                        <TableCell><strong>Autor</strong></TableCell>
                        <TableCell><strong>Precio</strong></TableCell>
                        <TableCell><strong>Precio de alquiler</strong></TableCell>
                        <TableCell><strong>Stock</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>{book.id}</TableCell>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>${book.price}</TableCell>
                          <TableCell>${book.rentalPrice}</TableCell>
                          <TableCell>{book.stock}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDescription(book.description || 'Sin descripción disponible')}
                            >
                              Ver
                            </Button>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenBookDialog(book)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteConfirm('book', book)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gestión de Usuarios
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Nombre</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Rol</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteConfirm('user', user)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gestión de Facturas
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Usuario</strong></TableCell>
                        <TableCell><strong>Fecha</strong></TableCell>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.id}</TableCell>
                          <TableCell>{bill.user.id || 'Usuario'}</TableCell>
                          <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                          <TableCell>${Number(bill.total).toFixed(2)}</TableCell>
                          <TableCell>{'Completado'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewBillDetails(bill.id)}
                              >
                                Ver detalles
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <BillDetailDialog
        bill={selectedBill}
        open={billDetailOpen}
        onClose={() => setBillDetailOpen(false)}
        isAdmin={true}
      />

      <Dialog
        open={openBookDialog}
        onClose={handleCloseBookDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedBook ? 'Editar Libro' : 'Nuevo Libro'}
        </DialogTitle>
        <form onSubmit={bookFormik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título"
                  value={bookFormik.values.title}
                  onChange={bookFormik.handleChange}
                  error={bookFormik.touched.title && Boolean(bookFormik.errors.title)}
                  helperText={bookFormik.touched.title && bookFormik.errors.title}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="author"
                  name="author"
                  label="Autor"
                  value={bookFormik.values.author}
                  onChange={bookFormik.handleChange}
                  error={bookFormik.touched.author && Boolean(bookFormik.errors.author)}
                  helperText={bookFormik.touched.author && bookFormik.errors.author}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Precio"
                  type="number"
                  value={bookFormik.values.price}
                  onChange={bookFormik.handleChange}
                  error={bookFormik.touched.price && Boolean(bookFormik.errors.price)}
                  helperText={bookFormik.touched.price && bookFormik.errors.price}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="rentalPrice"
                  name="rentalPrice"
                  label="Precio de alquiler mensual"
                  type="number"
                  value={bookFormik.values.rentalPrice}
                  onChange={bookFormik.handleChange}
                  error={bookFormik.touched.rentalPrice && Boolean(bookFormik.errors.rentalPrice)}
                  helperText={bookFormik.touched.rentalPrice && bookFormik.errors.rentalPrice}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="stock"
                  name="stock"
                  label="Stock disponible"
                  type="number"
                  value={bookFormik.values.stock}
                  onChange={bookFormik.handleChange}
                  error={bookFormik.touched.stock && Boolean(bookFormik.errors.stock)}
                  helperText={bookFormik.touched.stock && bookFormik.errors.stock}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="imageUrl"
                  name="imageUrl"
                  label="URL de la imagen"
                  value={bookFormik.values.imageUrl}
                  onChange={bookFormik.handleChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descripción"
                  multiline
                  rows={4}
                  value={bookFormik.values.description}
                  onChange={bookFormik.handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBookDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedBook ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este {itemToDelete?.type === 'book' ? 'libro' : 'usuario'}?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={descriptionDialogOpen}
        onClose={handleCloseDescriptionDialog}
      >
        <DialogTitle>Descripción del Libro</DialogTitle>
        <DialogContent>
          <Typography>{selectedBookDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDescriptionDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;