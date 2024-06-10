import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  CircularProgress,
  Pagination,
  TextField,
  Autocomplete,
  Grid,
  Paper,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  PostAdd,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, updateDoc, deleteDoc, orderBy, where } from 'firebase/firestore';
import { db } from "../../../firebase";
import AdminHeader from '../../../css/AdminHeader';
import CourseDetailsModal from './CourseDetailsModal';
import UpdateCourseForm from './UpdateCourseForm';
import CreateCourseForm from './CreateCourseForm';
import CourseStatistics from './CourseStatistics';
import AdminSideBar from '../AdminSideBar';

const customTheme = createTheme({
  typography: {
    fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
  },
  palette: {
    background: {
      default: '#f5f5f5', // Greyish white
    },
    primary: {
      main: '#795548', // Warm brown
    },
    secondary: {
      main: 'rgb(155, 6, 6)', // Cherry red
    },
  },
});

const Course = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(5);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [openCreateCourseDialog, setOpenCreateCourseDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'success', open: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'c_code', direction: 'asc' });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const courseSnapshot = await getDocs(
        query(collection(db, 'tbl_course'), orderBy('c_code', 'asc'))
      );
      const courseList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
      setFilteredCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseNameChange = (event, value) => {
    setSelectedCourseName(value);
    filterCourses(value);
  };

  const filterCourses = (name) => {
    let filtered = courses;
    if (name) {
      filtered = filtered.filter((course) =>
        course.c_name.toLowerCase().includes(name.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCoursesPerPageChange = (event) => {
    setCoursesPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateCourseClick = () => {
    setOpenCreateCourseDialog(true);
  };

  const handleCreateCourseDialogClose = () => {
    setOpenCreateCourseDialog(false);
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const viewCourse = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const updateCourse = async (updatedCourse) => {
    try {
      const courseQuery = query(collection(db, 'tbl_course'), where('c_code', '==', updatedCourse.c_code));
      const querySnapshot = await getDocs(courseQuery);

      if (!querySnapshot.empty) {
        const courseDocRef = querySnapshot.docs[0].ref;
        await updateDoc(courseDocRef, updatedCourse);
        fetchCourses();
        setSnackbar({ message: 'Course updated successfully!', severity: 'success', open: true });
      } else {
        setSnackbar({ message: 'Course not found.', severity: 'error', open: true });
      }
    } catch (error) {
      setSnackbar({ message: 'Error updating course.', severity: 'error', open: true });
      console.error('Error updating course:', error);
    }
  };

  const deleteCourse = async (course) => {
    try {
      const courseQuery = query(collection(db, 'tbl_course'), where('c_code', '==', course.c_code));
      const querySnapshot = await getDocs(courseQuery);

      if (!querySnapshot.empty) {
        const courseDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(courseDocRef);
        fetchCourses();
        setSnackbar({ message: 'Course deleted successfully!', severity: 'success', open: true });
      } else {
        setSnackbar({ message: 'Course not found.', severity: 'error', open: true });
      }
    } catch (error) {
      setSnackbar({ message: 'Error deleting course.', severity: 'error', open: true });
      console.error('Error deleting course:', error);
    }
  };

  const displayedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...displayedCourses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    }
    return null;
  };

  return (
    <ThemeProvider theme={customTheme}>
      <AdminHeader 
        handleMenu={handleMenu}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <AdminSideBar/>
      <Container>
        <Typography variant="h5" gutterBottom  sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins", marginTop: 1 ,marginLeft:55 }}>
          CSE - AAS : Admin Dashboard <br/>
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins", marginTop: 1, marginLeft:60 }}>
          Course Management
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={20} md={18}>
              <Paper elevation={3} style={{ padding: customTheme.spacing(2), overflowX: 'auto' }}>
                <TableContainer  style={{ maxWidth: '100%',color:'#000f38' }}>
                  <Typography variant="h5" component="h1" gutterBottom style={{ fontWeight: 'bold', color: '#000f38', textAlign: 'center' }}>
                    Course Details
                  </Typography>
                  <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: 1 }}>
                    <Autocomplete
                      options={courses.map((course) => course.c_name)}
                      value={selectedCourseName}
                      onChange={handleCourseNameChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Search Course by Name" variant="outlined" fullWidth />
                      )}
                      style={{ marginBottom: customTheme.spacing(2), minWidth: 200 }}
                    />
                    <Card elevation={3} style={{ padding: customTheme.spacing(1), display: 'flex', alignItems: 'center' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <PostAdd color="primary" style={{ fontSize: 30,color:'red '}} onClick={handleCreateCourseClick} sx={{ cursor: 'pointer' }} />
                          <Typography variant="h6" style={{ fontWeight: 'bold', marginLeft: '8px',color:'hsl(0, 0%, 20%)' }}>Add Course</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                    <FormControl variant="outlined" style={{ minWidth: 200 }}>
                      <InputLabel>Rows per page</InputLabel>
                      <Select
                        value={coursesPerPage}
                        onChange={handleCoursesPerPageChange}
                        label="Rows per page"
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Table stickyHeader>
                    <TableHead  >
                      <TableRow >
                        <TableCell style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('c_code')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Course Code {renderSortIcon('c_code')}
                          </Button>
                        </TableCell>
                        <TableCell style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('c_name')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Course Name {renderSortIcon('c_name')}
                          </Button>
                        </TableCell>
                        <TableCell style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('c_type')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Course Type {renderSortIcon('c_type')}
                          </Button>
                        </TableCell>
                        <TableCell style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('program')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Program {renderSortIcon('program')}
                          </Button>
                        </TableCell>
                        <TableCell  style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('semester')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Semester {renderSortIcon('semester')}
                          </Button>
                        </TableCell>
                        <TableCell style={{ background: 'rgb(166, 34, 34)'}}>
                          <Button onClick={() => requestSort('c_TC')} style={{ fontWeight: 'bold',color:'#fff' }}>
                            Course Credit {renderSortIcon('c_TC')}
                          </Button>
                        </TableCell>
                        <TableCell align='center' style={{ background: 'rgb(166, 34, 34)'}}>
                          <Typography variant="h6" style={{ fontWeight: 'bold',color:'#fff' }}>
                            Actions
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedCourses.map((course, index) => (
                        <TableRow
                          key={course.id}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'rgb(232, 208, 208)' : 'rgb(244, 233, 233)',
                            transition: 'background-color 0.3s',
                          }}
                          hover
                        >
                          <TableCell align='center' width='10px'>{course.c_code}</TableCell>
                          <TableCell align='center' width='10px'>{course.c_name}</TableCell>
                          <TableCell align='center' width='10px' >{course.c_type}</TableCell>
                          <TableCell align='center'>{course.program}</TableCell>
                          <TableCell align='center' >{course.semester}</TableCell>
                          <TableCell align='center' >{course.c_TC}</TableCell>
                          <TableCell align='center'>
                            <VisibilityIcon
                              onClick={() => viewCourse(course)}
                              sx={{ cursor: 'pointer',color:'rgb(50,46,162)',marginRight:2 }}
                            />
                            <EditIcon
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowUpdateModal(true);
                              }}
                              sx={{ cursor: 'pointer',color:'rgb(2,198,53)' ,marginRight:2 }}
                            />
                            <DeleteIcon
                              color="error"
                              onClick={() => deleteCourse(course)}
                              sx={{ cursor: 'pointer',marginRight:2}}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/*<Box mt={2} display="flex" justifyContent="center">
                    <Pagination
                      count={Math.ceil(filteredCourses.length / coursesPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      color='secondary'
                      style={{ fontWeight: 'bold', color:'red' }}
                    />
                  </Box>*/}
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        <CreateCourseForm
          open={openCreateCourseDialog}
          onClose={handleCreateCourseDialogClose}
          fetchCourses={fetchCourses}
          setSnackbar={setSnackbar}
          courses={courses}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          style={{ backgroundColor: snackbar.severity === 'error' ? customTheme.palette.error.main : customTheme.palette.success.main }}
        >
          <Alert onClose={closeSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {showDetailsModal && selectedCourse && (
          <CourseDetailsModal course={selectedCourse} onClose={() => setShowDetailsModal(false)} />
        )}

        {showUpdateModal && selectedCourse && (
          <UpdateCourseForm
            course={selectedCourse}
            onClose={() => setShowUpdateModal(false)}
            onUpdate={updateCourse}
          />
        )}
      </Container>
      </div>
    </ThemeProvider>
  );
};

export default Course;
