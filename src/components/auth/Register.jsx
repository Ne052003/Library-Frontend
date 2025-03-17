import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
        'Ingresa un correo electrónico válido'
      )
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .required('La contraseña es requerida')
      .min(8, 'La contraseña debe contener al menos 8 caracteres')
      .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .matches(/\d/, 'Debe contener al menos un número')
      .matches(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@$!%*?&)')
      .test(
        'password-strength',
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
        (value) => !!value // Esto garantiza que siempre se muestre el mensaje
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('Confirma tu contraseña'),
    fullName: Yup.string()
      .required('El nombre completo es requerido')
      .min(5, 'El nombre completo debe contener al menos 5 caracteres')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {

        const { confirmPassword, ...userData } = values;
        await register(userData);
        setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Error al registrarse. Por favor, inténtalo de nuevo.'
        );
      }
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        py: 4
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registro
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Nombre completo"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            margin="normal"
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            margin="normal"
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Registrarse
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/login')}
              >
                Inicia sesión
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;