import React, { useState } from 'react';
import { TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const AcademicYearForm = ({ open, onClose, onSubmit }) => {
  const [year, setYear] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(year);
    setYear('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Academic Year</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Academic Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcademicYearForm;
