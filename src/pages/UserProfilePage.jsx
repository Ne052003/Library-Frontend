import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../api/userService';
import billService from '../api/billService';
import BillDetailDialog from '../components/bills/BillDetailDialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userBills, setUserBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetailOpen, setBillDetailOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileData = await userService.getUserProfile(token);
        setUserProfile(profileData);

        const billsData = await billService.getUserBills();
        setUserBills(billsData);

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const validationSchema = Yup.object({
    fullName: Yup.string().required('El nombre completo es requerido'),
    email: Yup.string()
      .email('Ingresa un correo electrónico válido')
      .required('El correo electrónico es requerido'),
    address: Yup.string(),
    phoneNumber: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      fullName: userProfile?.fullName || '',
      email: userProfile?.email || '',
      address: userProfile?.address || '',
      phoneNumber: userProfile?.phoneNumber || ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await userService.updateUserProfile(values);
        setSuccessMessage('Perfil actualizado correctamente');
        setUserProfile({ ...userProfile, ...values });

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Error al actualizar el perfil. Por favor, intenta de nuevo.'
        );
      }
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
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
          <Tab label="Información Personal" />
          <Tab label="Mis Facturas" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de la cuenta
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {currentUser?.email}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Nombre:</strong> {currentUser?.fullName}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Rol:</strong> {currentUser?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                </Typography>

                {userProfile?.createdAt && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Miembro desde:</strong> {new Date(userProfile.createdAt).toLocaleDateString()}
                  </Typography>
                )}

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Editar perfil
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="fullName"
                        name="fullName"
                        label="Nombre completo"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                        helperText={formik.touched.fullName && formik.errors.fullName}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Correo electrónico"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="address"
                        name="address"
                        label="Dirección"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Número de teléfono"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Guardar cambios
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Historial de facturas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {userBills.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                No tienes facturas registradas.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {userBills.map((bill) => (
                  <Grid item xs={12} key={bill.id}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">
                            <strong>Factura #:</strong> {bill.id}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Fecha:</strong> {new Date(bill.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Tipo:</strong> {bill.type === 'PURCHASE' ? 'Compra' : 'Alquiler'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                          <Typography variant="body1">
                            <strong>Total:</strong> ${bill.total}
                          </Typography>
                          {bill.type === 'RENTAL' && (
                            <Typography variant="body2">
                              <strong>Días de alquiler:</strong> {bill.rentalDays}
                            </Typography>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => handleViewBillDetails(bill.id)}
                          >
                            Ver detalles
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}
      <BillDetailDialog
        bill={selectedBill}
        open={billDetailOpen}
        onClose={() => setBillDetailOpen(false)}
        isAdmin={true}
      />
    </Box>
  );
};

export default UserProfilePage; 