import React, { useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import LanguageContext from '../LanguageContext';

const NonLoggedInPage = ({ openLogin, openRegister }) => {
  const { language } = useContext(LanguageContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3">{language.Welcome}</Typography>
      <Typography variant="h6" sx={{ margin: '1rem 0' }}>{language.PleaseLogIn}</Typography>

    </Box>
  );
};

export default NonLoggedInPage;
