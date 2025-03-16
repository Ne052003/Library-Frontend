import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

const BillDetailDialog = ({ bill, open, onClose, isAdmin = false }) => {
  if (!bill) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="bill-detail-dialog-title"
    >
      <DialogTitle id="bill-detail-dialog-title">
        Detalles de Factura #{bill.id}
        {isAdmin && (
          <Typography variant="subtitle2" color="text.secondary">
            Usuario: {bill.user?.id || 'Usuario'}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Fecha:</strong> {formatDate(bill.date)}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Estado:</strong>{' '}
              <Chip
                label={bill.status || 'Completado'}
                color={
                  bill.status === 'PENDING' ? 'warning' :
                    bill.status === 'CANCELLED' ? 'error' : 'success'
                }
                size="small"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" align="right">
              <strong>Total:</strong> ${formatPrice(bill.total)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {bill.transactions && bill.transactions.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Transacciones
            </Typography>
            {bill.transactions.map((transaction, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1">
                  <strong>Tipo:</strong>{' '}
                  <Chip
                    label={transaction.type === 'purchase' ? 'Compra' : 'Alquiler'}
                    color={transaction.type === 'purchase' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Typography>

                {transaction.type === 'purchase' && transaction.items && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Libro</strong></TableCell>
                          <TableCell align="center"><strong>Cantidad</strong></TableCell>
                          <TableCell align="right"><strong>Precio</strong></TableCell>
                          <TableCell align="right"><strong>Subtotal</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transaction.items.map((item, itemIndex) => (
                          <TableRow key={itemIndex}>
                            <TableCell>{item.book?.title || 'Libro'}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">${formatPrice(item.book?.price || 0)}</TableCell>
                            <TableCell align="right">${formatPrice((item.book?.price || 0) * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {transaction.type === 'loan' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      <strong>Libro:</strong> {transaction.book?.title || 'Libro'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Precio de alquiler:</strong> ${formatPrice(transaction.book?.rentalPrice || 0)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Fecha de vencimiento:</strong> {formatDate(transaction.deadline)}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
        {isAdmin && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Información del usuario</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>ID:</strong> {bill.user?.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Nombre:</strong> {bill.user?.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Email:</strong> {bill.user?.email}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="contained" color="primary">
          Descargar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillDetailDialog; 