import React from 'react';
import { styled } from '@mui/system';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const ALogo = styled('img')({
  width: 120,
  height: 160,
});

const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'grey.100' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href='https://ptuniv.edu.in/' target="_blank" rel="noopener noreferrer">
              <Avatar sx={{ width: 250, height: 150, bgcolor: 'transparent', margin: 1 }}>
                <ALogo src="/ptu-logo.png" alt="Logo" />
              </Avatar>
            </a>
            <Box sx={{ textAlign: 'center', marginLeft: 2 }}>
              <Typography fontSize={20} component="div" sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins" }}>
                <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>P</span>UDUCHERRY
                <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>T</span>ECHNOLOGICAL
                <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>U</span>NIVERSITY
              </Typography>
              <Typography fontSize={20} component="div" sx={{ color: '#69180d', fontFamily: "Trebuchet MS" }}>
                Puducherry, India
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
