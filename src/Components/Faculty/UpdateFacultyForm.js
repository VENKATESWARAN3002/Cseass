import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust this import according to your file structure
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const theme = createTheme();

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2), // Added gap between form fields
    padding: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  dialog: {
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
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
  textField: {
    '& .MuiInputBase-input': {
      color: '#000', // Text color
    },
    '& .MuiInputLabel-root': {
      color: '#000', // Label color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#000', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#000', // Hover border color
      },
    },
  },
}));

const ALogo = styled('img')({
  width: 120,
  height: 160,
});

const UpdateFacultyForm = ({ faculty, onClose, onUpdate }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    fac_name: '',
    fac_desgn: '',
    fac_email: '',
    fac_dob: '',
    fac_gender: '',
    fac_spec: '',
    fac_spez: '',
    fac_AM: '',
    fac_phone: '',
    fac_exp: '',
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        fac_name: faculty.fac_name || '',
        fac_desgn: faculty.fac_desgn || '',
        fac_email: faculty.fac_email || '',
        fac_dob: faculty.fac_dob || '',
        fac_gender: faculty.fac_gender || '',
        fac_spec: faculty.fac_spec || '',
        fac_spez: faculty.fac_spez || '',
        fac_AM: faculty.fac_AM || '',
        fac_phone: faculty.fac_phone || '',
        fac_exp: faculty.fac_exp || '',
      });
    }
  }, [faculty]);

  if (!faculty) {
    return null; // or return loading indicator, depending on your use case
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facultyDocRef = doc(db, 'tbl_faculty', faculty.id);
      await updateDoc(facultyDocRef, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle className={classes.title}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 140, height: 180, bgcolor: 'transparent' }}>
              <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            <Box mt={2}>Update Faculty Details</Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" className={classes.form} onSubmit={handleSubmit}>
            <TextField
              label="Faculty Name"
              name="fac_name"
              value={formData.fac_name}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Designation"
              name="fac_desgn"
              value={formData.fac_desgn}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="E-Mail"
              name="fac_email"
              value={formData.fac_email}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="DOB"
              name="fac_dob"
              value={formData.fac_dob}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Gender"
              name="fac_gender"
              value={formData.fac_gender}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Qualifications"
              name="fac_spec"
              value={formData.fac_spec}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Specializations"
              name="fac_spez"
              value={formData.fac_spez}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Alama mater"
              name="fac_AM"
              value={formData.fac_AM}
              onChange={handleChange}
              fullWidth
              multiline
            rows={4}
            />
            <TextField
              label="Phone"
              name="fac_phone"
              value={formData.fac_phone}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Experience"
              name="fac_exp"
              value={formData.fac_exp}
              onChange={handleChange}
              fullWidth
              className={classes.textField}
            />
            <Box display="flex" justifyContent="flex-end">
              <DialogActions className={classes.actions}>
                <Button onClick={onClose} color="secondary" variant="outlined" className={classes.button}>
                  Close
                </Button>
                <Button type="submit" color="primary" variant="contained" className={classes.button}>
                  Update
                </Button>
              </DialogActions>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default UpdateFacultyForm;
