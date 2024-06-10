import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Adjust path as necessary
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography,
  Box, Container, Snackbar, Alert, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ProgramStatisticsIcon from '@mui/icons-material/BarChart';
import AcademicYearForm from './AcademicYearForm';
import UploadSyllabus from './UploadSyllabus'; // Adjust path as necessary
import ProgramStatistics from './ProgramStatistics'; // Adjust path as necessary
import AdminProgramStatistics from './Admin ProgramProgramStatistics';
import AdminSideBar from '../AdminSideBar';
import AdminHeader from '../../../css/AdminHeader';

const ProgramForm = ({ open, onClose, onSubmit }) => {
  const [programName, setProgramName] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    onSubmit(programName, totalCredits, duration);
    setProgramName('');
    setTotalCredits('');
    setDuration('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Program</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
               label="Program Name"
              fullWidth
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Credits"
              fullWidth
              value={totalCredits}
              onChange={(e) => setTotalCredits(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Duration (Years)"
              fullWidth
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [programFormOpen, setProgramFormOpen] = useState(false);
  const [academicYearFormOpen, setAcademicYearFormOpen] = useState(false);
  const [uploadSyllabusOpen, setUploadSyllabusOpen] = useState(false);
  const [programStatisticsOpen, setProgramStatisticsOpen] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const programsSnapshot = await getDocs(collection(db, 'tbl_program'));
      const programsList = programsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrograms(programsList);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setSnackbarMessage('Error fetching programs. Please try again.');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleProgramSubmit = async (programName, totalCredits, duration) => {
    setLoading(true);
    try {
      const noOfCourses = await fetchCoursesCount(programName);

      await addDoc(collection(db, 'tbl_program'), {
        program_name: programName,
        total_credits: totalCredits,
        no_of_courses: noOfCourses,
        no_of_year: duration,
      });

      setSnackbarMessage('Program created successfully!');
      setSnackbarOpen(true);
      fetchPrograms();
    } catch (error) {
      console.error('Error creating program:', error);
      setSnackbarMessage('Error creating program. Please try again.');
      setSnackbarOpen(true);
    }
    setLoading(false);
    setProgramFormOpen(false);
  };

  const handleAcademicYearSubmit = async (year) => {
    setLoading(true);
    try {
      if (selectedProgram) {
        const programRef = doc(db, 'tbl_program', selectedProgram.id);
        await addDoc(collection(programRef, 'academic_year'), { year });
        setSnackbarMessage('Academic Year added successfully!');
        setSnackbarOpen(true);
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error adding academic year:', error);
      setSnackbarMessage('Error adding academic year. Please try again.');
      setSnackbarOpen(true);
    }
    setLoading(false);
    setAcademicYearFormOpen(false);
  };

  const fetchCoursesCount = async (programName) => {
    try {
      const coursesSnapshot = await getDocs(query(collection(db, 'tbl_course'), where('program', '==', programName)));
      return coursesSnapshot.size;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return 0;
    }
  };

   const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setAcademicYearFormOpen(true);
  };

  const handleUploadSyllabusClick = (program) => {
    setSelectedProgram(program);
    setUploadSyllabusOpen(true);
  };

  const handleDeleteProgram = async (programId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'tbl_program', programId));
      setSnackbarMessage('Program deleted successfully!');
      setSnackbarOpen(true);
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      setSnackbarMessage('Error deleting program. Please try again.');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleViewProgramStatistics = (program) => {
    setSelectedProgram(program);
    setProgramStatisticsOpen(true);
  };

  return (
    <>
    <AdminHeader/>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
    <AdminSideBar/>
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Program Management</Typography>
        <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={() => setProgramFormOpen(true)}>
          Create New Program
        </Button>
      </Box>
      <ProgramForm
        open={programFormOpen}
        onClose={() => setProgramFormOpen(false)}
        onSubmit={handleProgramSubmit}
      />
      <AcademicYearForm
        open={academicYearFormOpen}
        onClose={() => setAcademicYearFormOpen(false)}
        onSubmit={handleAcademicYearSubmit}
      />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Available Programs</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Total Credits</TableCell>
                  <TableCell>Number of Courses</TableCell>
                  <TableCell>Duration (Years)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.program_name}</TableCell>
                    <TableCell>{program.total_credits}</TableCell>
                    <TableCell>{program.no_of_courses}</TableCell>
                    <TableCell>{program.no_of_year}</TableCell>
                    <TableCell>
                      <Tooltip title="Add Academic Year">
                        <SchoolIcon color="secondary" onClick={() => handleProgramClick(program)} sx={{ marginRight: 2, cursor: 'pointer' }} />
                      </Tooltip>
                      <Tooltip title="Upload Syllabus">
                        <UploadFileIcon color="primary" onClick={() => handleUploadSyllabusClick(program)} sx={{ marginRight: 2, cursor: 'pointer' }} />
                      </Tooltip>
                      <Tooltip title="Delete Program">
                        <DeleteIcon color="error" onClick={() => handleDeleteProgram(program.id)} sx={{ marginRight: 2, cursor: 'pointer' }} />
                      </Tooltip>
                      <Tooltip title="View Program Statistics">
                        <ProgramStatisticsIcon color="primary" onClick={() => handleViewProgramStatistics(program)} sx={{ marginRight: 2, cursor: 'pointer' }} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {selectedProgram && (
        <ProgramStatistics
          programName={selectedProgram.program_name}
          open={programStatisticsOpen}
          onClose={() => setProgramStatisticsOpen(false)}
        />
      )}
      <UploadSyllabus
        open={uploadSyllabusOpen}
        onClose={() => setUploadSyllabusOpen(false)}
        programId={selectedProgram?.id}
        programName={selectedProgram?.program_name}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <AdminProgramStatistics/>
    </Container>
    </div>
    </>
  );
};

export default ProgramManagement;

