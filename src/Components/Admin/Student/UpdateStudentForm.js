import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, TextField, Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
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

const UpdateStudentForm = ({ student, onClose, onUpdate }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    register_no: '',
    std_name: '',
    std_email: '',
    std_phone: '',
    std_dob: '',
    std_gender: '',
    address: '',
  });

  useEffect(() => {
    // Pre-fill the form with student data when the component mounts
    setFormData({
      register_no: student.register_no,
      std_name: student.std_name,
      std_email: student.std_email,
      std_phone: student.std_phone,
      std_dob: student.std_dob,
      std_gender: student.std_gender,
      address: student.address,
    });
  }, [student]); // Update effect on student data change

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} PaperProps={{ className: classes.dialog }}>
      <DialogTitle className={classes.title}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: 140, height: 180, bgcolor: 'transparent' }}>
            <ALogo src="/ptu-logo.png" alt="Logo" />
          </Avatar>
          <Box mt={2}>Update Student Details</Box>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Register No."
                value={formData.register_no}
                disabled
                fullWidth
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="std_name"
                value={formData.std_name}
                onChange={handleChange}
                fullWidth
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Email"
                name="std_email"
                value={formData.std_email}
                onChange={handleChange}
                fullWidth
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Phone"
                name="std_phone"
                value={formData.std_phone}
                onChange={handleChange}
                fullWidth
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                type="date"
                name="std_dob"
                value={formData.std_dob}
                onChange={handleChange}
                fullWidth
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Gender"
                name="std_gender"
                value={formData.std_gender}
                onChange={handleChange}
                fullWidth
                className={classes.textField}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                fullWidth
                className={classes.textField}
              />
            </Grid>
          </Grid>
          <DialogActions className={classes.actions}>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Update Student
            </Button>
            <Button onClick={onClose} variant="outlined" color="primary" className={classes.button}>
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentForm;
