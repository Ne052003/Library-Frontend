import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
import BillList from '../components/bills/BillList';
import billService from '../api/billService';
import BillDetailDialog from '../components/bills/BillDetailDialog';
import { useNotification } from '../context/NotificationContext';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billService.getUserBills();
      setBills(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las facturas. Por favor, intenta de nuevo más tarde.');
      showNotification('Error al cargar las facturas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (billId) => {
    try {
      const billDetails = await billService.getBillById(billId);
      setSelectedBill(billDetails);
      setOpenDialog(true);
    } catch (err) {
      showNotification('Error al cargar los detalles de la factura', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={fetchBills}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Facturas
      </Typography>

      {bills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No tienes facturas registradas.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            href="/books"
          >
            Explorar libros
          </Button>
        </Paper>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nº Factura</strong></TableCell>
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
                      <TableCell>{formatDate(bill.date)}</TableCell>
                      <TableCell>${Number(bill.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={bill.status || 'Completado'}
                          color={
                            bill.status === 'PENDING' ? 'warning' :
                              bill.status === 'CANCELLED' ? 'error' : 'success'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(bill.id)}
                        >
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <BillDetailDialog
        bill={selectedBill}
        open={openDialog}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default BillsPage;