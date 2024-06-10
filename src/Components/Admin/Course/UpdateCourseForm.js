import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Avatar,styled } from '@mui/material';
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

const UpdateCourseForm = ({ course, onClose, onUpdate }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    c_code: '',
    c_name: '',
    c_type: '',
    program: '',
    semester: '',
    c_TC: '',
    COs: '',
  });

  useEffect(() => {
    // Pre-fill the form with course data when the component mounts
    setFormData({
      c_code: course.c_code,
      c_name: course.c_name,
      c_type: course.c_type,
      program: course.program,
      semester: course.semester,
      c_TC: course.c_TC,
      COs: course.COs,
    });
  }, [course]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data to update:', formData);
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className={classes.title}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: 140, height: 180, bgcolor: 'transparent' }}>
            <ALogo src="/ptu-logo.png" alt="Logo" />
          </Avatar>
          <Box mt={2}>Update Course Details</Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Course Code"
            name="c_code"
            value={formData.c_code}
            disabled
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Course Name"
            name="c_name"
            value={formData.c_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Course Type"
            name="c_type"
            value={formData.c_type}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Total Credits"
            name="c_TC"
            value={formData.c_TC}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Course Outcomes"
            name="COs"
            value={formData.COs}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose} color="secondary" variant="outlined">Close</Button>
        <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>Update Course</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCourseForm;
