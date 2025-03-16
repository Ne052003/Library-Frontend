import React from 'react';
import { Alert, Box, Button } from '@mui/material';

const ErrorMessage = ({ 
  message = 'Ha ocurrido un error.', 
  onRetry = null 
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity="error"
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small"
              onClick={onRetry}
            >
              Reintentar
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage; 