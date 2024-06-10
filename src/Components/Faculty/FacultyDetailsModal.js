import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const theme = createTheme();

const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  title: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  content: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  actions: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  card: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  iconButton: {
    padding: 0,
    marginRight: theme.spacing(1),
  },
}));

const ALogo = styled('img')({
  width: 140,
  height: 180,
});

const FacultyDetailsModal = ({ faculty, onClose }) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={true} onClose={onClose} className={classes.dialog}>
        <DialogTitle className={classes.title}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 180, height: 180, bgcolor: 'transparent' }}>
              <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            <Typography variant="h6">Faculty Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {faculty ? (
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <Paper className={classes.card}>
                  <Typography variant="subtitle1">
                    <b>Name:</b> {faculty.fac_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Date of Birth:</b> {faculty.fac_dob}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Designation:</b> {faculty.fac_desgn}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Qualifications:</b> {faculty.fac_spec}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Specializations:</b> {faculty.fac_spez}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Experience (in years):</b> {faculty.fac_exp}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Alma mater:</b> {faculty.fac_AM}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <IconButton className={classes.iconButton}>
                      <EmailIcon color="primary" />
                    </IconButton>
                    <Typography variant="subtitle1">{faculty.fac_email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <IconButton className={classes.iconButton}>
                      <PhoneIcon color="primary" />
                    </IconButton>
                    <Typography variant="subtitle1">{faculty.fac_phone}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1">Faculty information is unavailable.</Typography>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default FacultyDetailsModal;
