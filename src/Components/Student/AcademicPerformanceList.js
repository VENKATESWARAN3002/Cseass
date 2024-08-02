import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import {
  Container,
  Typography,
  Table,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Box,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import GSIcon from './GSIcon.png';
import VisibilityIcon from '@mui/icons-material/Visibility';

const theme = createTheme();

const GradeSheet = styled('img')({
  width: 100,
  height: 100,
});

const CustomChip = styled(Chip)(({ grade }) => {
  const gradeColors = {
    S: { backgroundColor: '#4b3b76', color: 'white' },
    A: { backgroundColor: '#28a745', color: 'white' },
    B: { backgroundColor: '#007bff', color: 'white' },
    C: { backgroundColor: '#ffc107', color: 'white' },
    D: { backgroundColor: '#fd7e14', color: 'white' },
    E: { backgroundColor: '#dc3545', color: 'white' },
    F: { backgroundColor: '#8B0000', color: 'white' },
  };
  return gradeColors[grade] || {};
});

const useStyles = makeStyles(() => ({
  list: {
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid #ddd',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));

function AcademicPerformanceList() {
  const [academicPerformances, setAcademicPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [registerNo, setRegisterNo] = useState('');
  const [gradeSheetOpen, setGradeSheetOpen] = useState(false);

  useEffect(() => {
    if (registerNo) {
      fetchAcademicPerformances();
    }
  }, [registerNo]);

  const fetchAcademicPerformances = async () => {
    setLoading(true);
    try {
      const studentsCollectionRef = collection(db, 'tbl_Student');
      const q = query(studentsCollectionRef, where('register_no', '==', registerNo));
      const studentsSnapshot = await getDocs(q);
      const performances = [];

      for (const studentDoc of studentsSnapshot.docs) {
        const studentId = studentDoc.id;
        const studentData = studentDoc.data();
        const studentRegNo = studentData.register_no;

        const performanceCollectionRef = collection(db, 'tbl_Student', studentId, 'academic_performance');
        const performanceSnapshot = await getDocs(performanceCollectionRef);

        performanceSnapshot.forEach((performanceDoc) => {
          const performanceData = performanceDoc.data();
          performances.push({ studentId, studentRegNo, docId: performanceDoc.id, ...performanceData });
        });
      }

      setAcademicPerformances(performances);
    } catch (error) {
      console.error('Error fetching academic performances:', error);
      setSnackbarMessage('Error fetching academic performances. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (performance) => {
    setSelectedPerformance(performance);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPerformance) {
      try {
        const performanceDocRef = doc(db, 'tbl_Student', selectedPerformance.studentId, 'academic_performance', selectedPerformance.docId);
        await deleteDoc(performanceDocRef);
        setSnackbarMessage('Performance data deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchAcademicPerformances();
      } catch (error) {
        console.error('Error deleting performance:', error);
        setSnackbarMessage('Error deleting performance. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setDialogOpen(false);
      }
    }
  };

  const handleRegisterNoChange = (event) => {
    setRegisterNo(event.target.value);
  };

  const handleViewClick = (performance) => {
    setSelectedPerformance(performance);
    setGradeSheetOpen(true);
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Academic Performance List
          </Typography>
          <TextField
            fullWidth
            label="Student Registration Number"
            value={registerNo}
            onChange={handleRegisterNoChange}
            sx={{ mb: 2 }}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Registration Number</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>GPA</TableCell>
                    <TableCell>Grade Sheet</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academicPerformances.map((performance, index) => (
                    <TableRow key={index}>
                      <TableCell>{performance.studentRegNo}</TableCell>
                      <TableCell>{performance.program}</TableCell>
                      <TableCell>{performance.semester}</TableCell>
                      <TableCell>{performance.gpa}</TableCell>
                      <TableCell>
                        <GradeSheet
                          src={GSIcon}
                          onClick={() => handleViewClick(performance)}
                          color="primary"
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteClick(performance)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this performance data? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={gradeSheetOpen}
            onClose={() => setGradeSheetOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Grade Sheet</DialogTitle>
            <DialogContent>
              {selectedPerformance && (
                <List className={classes.list}>
                  {selectedPerformance.courses && selectedPerformance.courses.map((course, idx) => (
                    <ListItem key={idx} className={classes.listItem}>
                      <ListItemIcon>
                        <BookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={`${course.c_code} - ${course.c_name}`} />
                      <Tooltip title={`Grade: ${course.grade}`} placement="top">
                        <CustomChip className={classes.chip} grade={course.grade} label={course.grade} />
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setGradeSheetOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AcademicPerformanceList;
