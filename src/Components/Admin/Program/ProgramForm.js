import React, { useState } from 'react';
import { TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ProgramForm = ({ open, onClose, onSubmit }) => {
  const [programName, setProgramName] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(programName, totalCredits, duration);
    setProgramName('');
    setTotalCredits('');
    setDuration('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Program</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Program Name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Credits"
                value={totalCredits}
                onChange={(e) => setTotalCredits(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (Years)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramForm;
