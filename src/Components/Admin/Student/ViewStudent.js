import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import StudentsList from './StudentList';
import { styled } from '@mui/system'
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  LinearProgress,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdminSideBar from '../AdminSideBar';

// Custom theme with innovative colors
const theme = createTheme({
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
      main: '#e74c3c', // Cherry red
    },
  },
});

const ALogo = styled('img')({
  width: 120,
  height: 160,
});

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setAnchorEl(null);
  };

  // Fetch programs from Firestore
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const programsCollection = collection(db, 'tbl_program');
      const querySnapshot = await getDocs(programsCollection);
      const programData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPrograms(programData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch academic years for a selected program
  const fetchAcademicYears = async (programName) => {
    if (!programName) return;

    try {
      const programQuery = query(collection(db, 'tbl_program'), where('program_name', '==', programName));
      const programQuerySnapshot = await getDocs(programQuery);

      if (programQuerySnapshot.empty) {
        console.warn(`Program with name "${programName}" not found.`);
        return;
      }

      const programDoc = programQuerySnapshot.docs[0];
      const programRef = doc(db, 'tbl_program', programDoc.id);

      const academicYearsCollection = collection(programRef, 'academic_year');
      const academicYearsSnapshot = await getDocs(academicYearsCollection);

      const academicYearsData = academicYearsSnapshot.docs.map(doc => doc.data());

      setAcademicYears(academicYearsData);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  // Fetch student details for a selected program and year
  const fetchStudentDetails = async (programName, academicYear) => {
    setIsLoading(true);
    try {
      let studentQuery;
      if (academicYear) {
        studentQuery = query(
          collection(db, 'tbl_Student'),
          where('program', '==', programName),
          where('academic_year', '==', academicYear)
        );
      } else {
        studentQuery = query(
          collection(db, 'tbl_Student'),
          where('program', '==', programName)
        );
      }

      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        console.warn(`No students found for program "${programName}"${academicYear ? ` and year "${academicYear}"` : ''}.`);
        setSnackbarMessage(`No students found for program "${programName}"${academicYear ? ` and year "${academicYear}"` : ''}.`);
        setSnackbarOpen(true);
        return;
      }

      const studentData = studentSnapshot.docs.map(doc => doc.data());
      studentData.sort((a, b) => a.register_no - b.register_no);
      setStudents(studentData);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setSnackbarMessage('Error fetching student details');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle program selection
  const handleProgramSelect = async (programData) => {
    setSelectedProgram(programData);
    setSelectedYear(null);
    setStudents([]);
    await fetchAcademicYears(programData.program_name);
    await fetchStudentDetails(programData.program_name);
  };

  // Handle year selection
  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    await fetchStudentDetails(selectedProgram.program_name, year);
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Snackbar transition effect
  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ bgcolor: 'grey.100' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href='https://ptuniv.edu.in/' target="_blank" rel="noopener noreferrer">
            <Avatar sx={{ width: 250, height: 150, bgcolor: 'transparent',margin:1 }}>
                    <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            </a>
              <Box sx={{ textAlign: 'center', marginLeft: 2 }}>
                <Typography fontSize={20} component="div" sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins" }}>
                  <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>P</span>UDUCHERRY
                  <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>T</span>ECHNOLOGICAL
                  <span style={{ display: 'inline', color: '#69180d', fontSize: 40 }}>U</span>NIVERSITY
                </Typography>
                <Typography fontSize={20} component="div" sx={{ color: '#69180d', fontFamily: "Trebuchet MS" }}>
                  Puducherry, India
                </Typography>
              </Box>
            </Box>
          </Box>
          <NotificationsActiveIcon sx={{ color: 'darkblue', ml: 1 }} />
          <IconButton color="inherit" onClick={handleMenu}>
            <Avatar alt="Admin" src="/static/images/avatar/1.jpg" sx={{ ml: 1 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <AdminSideBar/>
      <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom align="center"sx={{  fontWeight: 'bold',color: '#69180d' ,fontFamily:"Poppins" ,marginTop:1  }}>
                  CSE - AAS :
                  Admin Dashboard <br/>
          </Typography>
        <Typography variant="h5" gutterBottom align="center"sx={{  fontWeight: 'bold', marginTop: 1,color: '#69180d' ,fontFamily:"Poppins"  }}>
                  Student Details
        </Typography>
        <Box>
          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={12} md={4}>
              <Typography component="h5" variant="h5" sx={{ padding: 2 }}>Programs</Typography>
              <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
                <Grid container spacing={2}>
                  {programs.map((program) => (
                    <Grid item xs={12} sm={6} md={12} key={program.id} sx={{ padding: 2 , margin:1,}}>
                      <Tooltip title="Click to select this program" arrow>
                        <CardActionArea onClick={() => handleProgramSelect(program)}>
                          <Card
                            sx={{
                              fontWeight:'bold',
                              display: 'flex',
                              
                              color: selectedProgram?.id === program.id ? '#fff' : '#000',
                              background: selectedProgram?.id === program.id ? 'linear-gradient(135deg, #795548, #5d4037)' : '#fff',
                              transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                              border: selectedProgram?.id === program.id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                              padding: 1,
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                              },
                            }}
                          >
                            <CardContent sx={{ flex: '1 0 auto' }}>
                              <Typography component="h5" variant="h5" fontSize="1rem">
                                {program.program_name}
                              </Typography>
                            </CardContent>
                            <SchoolIcon sx={{ margin: 'auto 16px' }} />
                          </Card>
                        </CardActionArea>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            {selectedProgram && (
              <Grid item xs={12} md={4}>
                <Typography component="h5" variant="h5" sx={{ padding: 2 }}>Academic Years</Typography>
                <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
                  <Grid container spacing={2}>
                    {academicYears.map((year) => (
                      <Grid item xs={12} sm={6} md={12} key={year.year} sx={{padding: 2 , margin:1, }}>
                        <Tooltip title="Click to select this year" arrow>
                          <CardActionArea onClick={() => handleYearSelect(year.year)}>
                            <Card
                              sx={{
                                display: 'flex',
                                background: selectedYear === year.year ? 'linear-gradient(135deg, #e74c3c, #e74c3c)' : '#fff',
                                transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                                color: selectedYear === year.year ? '#fff' : '#000',
                                border: selectedYear === year.year ? `2px solid ${theme.palette.secondary.main}` : '2px solid transparent',
                                padding: 1,
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                                },
                              }}
                            >
                              <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="h5" variant="h5" fontSize="1rem">
                                  {year.year}
                                </Typography>
                              </CardContent>
                              <CalendarTodayIcon sx={{ margin: 'auto 16px' }} />
                            </Card>
                          </CardActionArea>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
        <Box mt={4}>
          {isLoading ? (
            <Box sx={{ width: '100%' }}>
              <LinearProgress color="primary" />
            </Box>
          ) : (
            <StudentsList
              program={selectedProgram}
              academicYear={selectedYear}
              students={students}
            />
          )}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          TransitionComponent={TransitionUp}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      </div>
    </ThemeProvider>
  );
};

export default ViewStudent;
