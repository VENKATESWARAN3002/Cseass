import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Adjust path as necessary
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Typography, CircularProgress, Box, LinearProgress, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, Card, CardContent, CardHeader, Grid, Avatar } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CountUp from 'react-countup';

const ProgramStatistics = ({ programName, open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [programCapacities, setProgramCapacities] = useState({
    MCA: 30,
   'M.Tech': 30,
  'B.Tech(CSE)': 120
  });
  const [maxCapacity, setMaxCapacity] = useState(programCapacities[programName]);
  const [newCapacity, setNewCapacity] = useState(maxCapacity);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTotalStudents();
    setMaxCapacity(programCapacities[programName]);
  }, [programName]);

  const fetchTotalStudents = async () => {
    setLoading(true);
    try {
      const studentsSnapshot = await getDocs(query(collection(db, 'tbl_Student'), where('program', '==', programName)));
      const total = studentsSnapshot.docs.length;
      setTotalStudents(total);
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
    setLoading(false);
  };

  const calculateProgress = () => {
    return (totalStudents / maxCapacity) * 100;
  };

  const handleEditCapacity = () => {
    setOpenDialog(true);
  };

  const handleSaveCapacity = () => {
    setProgramCapacities(prev => ({ ...prev, [programName]: newCapacity }));
    setMaxCapacity(newCapacity);
    setOpenDialog(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Program Statistics</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">{programName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h6" align="center">Enrolled Students</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Avatar sx={{ backgroundColor: '#3f51b5', width: 56, height: 56, mr: 2 }}>
                        <Typography variant="h6">
                          <CountUp end={totalStudents} duration={1.5} />
                        </Typography>
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h6" align="center">Total Seats</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Avatar sx={{ backgroundColor: '#3f51b5', width: 56, height: 56, mr: 2 }}>
                        <Typography variant="h6">{maxCapacity}</Typography>
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="center">Enrollment Percentage: {calculateProgress().toFixed(2)}%</Typography>
                <LinearProgress variant="determinate" value={calculateProgress()} sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Button variant="outlined" onClick={handleEditCapacity} startIcon={<EditIcon />}>Edit Capacity</Button>
              </Grid>
            </Grid>
          </Box>
        )}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Program Capacity</DialogTitle>
          <DialogContent>
            <TextField
              label="New Capacity"
              type="number"
              value={newCapacity}
              onChange={(e) => setNewCapacity(parseInt(e.target.value))}
              fullWidth
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="outlined" onClick={() => setOpenDialog(false)} sx={{ mr: 1 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveCapacity}>Save</Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramStatistics;
