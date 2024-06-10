import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid #ddd',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  chip: {
    fontWeight: 'bold',
  },
  gradeA: { backgroundColor: '#28a745', color: 'white' },
  gradeB: { backgroundColor: '#ffc107', color: 'white' },
  gradeC: { backgroundColor: '#17a2b8', color: 'white' },
  gradeD: { backgroundColor: '#fd7e14', color: 'white' },
  gradeF: { backgroundColor: '#dc3545', color: 'white' },
}));

function AcademicPerformanceList() {
  const [academicPerformances, setAcademicPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [semesters, setSemesters] = useState([
    'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'
  ]);

  useEffect(() => {
    fetchAcademicPerformances();
  }, []);

  const fetchAcademicPerformances = async () => {
    setLoading(true);
    try {
      const studentsCollectionRef = collection(db, 'tbl_Student');
      const studentsSnapshot = await getDocs(studentsCollectionRef);
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

      performances.sort((a, b) => (a.studentRegNo > b.studentRegNo ? 1 : -1));

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

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const filteredPerformances = selectedSemester
    ? academicPerformances.filter(performance => performance.semester === selectedSemester)
    : academicPerformances;

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Academic Performance List
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Semester</InputLabel>
            <Select
              value={selectedSemester}
              onChange={handleSemesterChange}
              label="Semester"
            >
              <MenuItem value="">
                <em>All Semesters</em>
              </MenuItem>
              {semesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                    <TableCell>Courses</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPerformances.map((performance, index) => (
                    <TableRow key={index}>
                      <TableCell>{performance.studentRegNo}</TableCell>
                      <TableCell>{performance.program}</TableCell>
                      <TableCell>{performance.semester}</TableCell>
                      <TableCell>{performance.gpa}</TableCell>
                      <TableCell>
                        <List className={classes.list}>
                          {performance.courses && performance.courses.map((course, idx) => (
                            <ListItem key={idx} className={classes.listItem}>
                              <ListItemIcon>
                                <BookIcon color="primary" />
                              </ListItemIcon>
                              <Tooltip title={`Course Code: ${course.c_code}`} arrow>
                                <ListItemText primary={`${course.c_code} - ${course.c_name}`} />
                              </Tooltip>
                              <Chip
                                label={course.grade}
                                className={`${classes.chip} ${classes[`grade${course.grade.charAt(0)}`]}`}
                              />
                            </ListItem>
                          ))}
                        </List>
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
