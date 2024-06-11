import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Avatar, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

const useStyles = makeStyles((theme) => ({
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
}));

const ALogo = styled('img')({
  width: 140,
  height: 180,
});

const StudentDetailsModal = ({ student, onClose }) => {
  const classes = useStyles();

  // Handle potential scenario where student data is missing
  if (!student) {
    return (
      <Dialog open={true} onClose={onClose} className={classes.dialog}>
        <DialogTitle className={classes.title}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 120, height: 180, bgcolor: 'transparent' }}>
              <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            <Typography variant="h6">Student Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Typography variant="body1">Student information unavailable.</Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={onClose} className={classes.dialog}>
      <DialogTitle className={classes.title}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: 180, height: 180, bgcolor: 'transparent' }}>
            <ALogo src="/ptu-logo.png" alt="Logo" />
          </Avatar>
          <Typography variant="h6">Student Details</Typography>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={3} sx={{marginTop:2}}>
          <Grid item xs={12} sm={5}>
            <Typography variant="subtitle1"><b>RegNo:</b> {student.register_no}</Typography>
            <Typography variant="subtitle1"><b>Name:</b> {student.std_name}</Typography>
            <Typography variant="subtitle1"><b>DOB:</b> {student.std_dob}</Typography>
            <Typography variant="subtitle1"><b>Gender:</b> {student.std_gender}</Typography>
            <Typography variant="subtitle1"><b>Program:</b> {student.program}</Typography>
            <Typography variant="subtitle1"><b>Academic Year:</b> {student.academic_year}</Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="subtitle1"><b>Email:</b> {student.std_email}</Typography>
            <Typography variant="subtitle1"><b>Address:</b> {student.address}</Typography>
            <Typography variant="subtitle1"><b>Phone:</b> {student.std_phone}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailsModal;