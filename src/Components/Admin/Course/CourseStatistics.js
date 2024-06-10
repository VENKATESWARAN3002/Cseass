import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CountUp from 'react-countup';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

const CourseStatistics = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'success', open: false });

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
    } catch (error) {
      console.error('Error fetching courses:', error);
      setSnackbar({ message: 'Error fetching courses.', severity: 'error', open: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Compute total courses and total credits by type and semester
  const totalCourses = courses.length;
  const coursesByType = courses.reduce((acc, course) => {
    const type = course.c_type;
    if (!acc[type]) {
      acc[type] = { count: 0, totalCredits: 0 };
    }
    acc[type].count += 1;
    acc[type].totalCredits += parseInt(course.c_TC, 10);
    return acc;
  }, {});

  const coursesBySemester = courses.reduce((acc, course) => {
    const semester = course.semester;
    if (!acc[semester]) {
      acc[semester] = { BC: { count: 0, totalCredits: 0 }, PCC: { count: 0, totalCredits: 0 }, PAC: { count: 0, totalCredits: 0 }, 'PSE-1': { count: 0, totalCredits: 0 }, 'PSE-2': { count: 0, totalCredits: 0 }, 'PSE-3': { count: 0, totalCredits: 0 }, 'PSE-4': { count: 0, totalCredits: 0 }, 'PSE-5': { count: 0, totalCredits: 0 }, totalCourses: 0, totalCredits: 0 };
    }
    if (!acc[semester][course.c_type]) {
      acc[semester][course.c_type] = { count: 0, totalCredits: 0 };
    }
    acc[semester][course.c_type].count += 1;
    acc[semester][course.c_type].totalCredits += parseInt(course.c_TC, 10);
    acc[semester].totalCourses += 1;
    acc[semester].totalCredits += parseInt(course.c_TC, 10);
    return acc;
  }, {});

  const pieData = Object.entries(courses.reduce((acc, course) => {
    acc[course.c_type] = (acc[course.c_type] || 0) + 1;
    return acc;
  }, {})).map(([key, value]) => ({ name: key, value }));

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57', '#FF7300'];

  return (
    <Container>
      <Typography variant="h4" component="h1" marginTop={2} gutterBottom style={{ fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}>
        Course Statistics
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  Total Number of Courses
                </Typography>
                <Typography variant="body1" style={{ marginBottom: 20, textAlign: 'center' }}>
                  <strong>
                    <CountUp end={totalCourses} duration={2} />
                  </strong>
                </Typography>
              </Paper>
              <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Course Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={isSmallScreen ? 60 : 80}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  Total Courses and Credits by Type
                </Typography>
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Course Type</strong></TableCell>
                        <TableCell><strong>Total Courses</strong></TableCell>
                        <TableCell><strong>Total Credits</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(coursesByType).map(([type, { count, totalCredits }]) => (
                        <TableRow key={type}>
                          <TableCell>{type}</TableCell>
                          <TableCell>{count}</TableCell>
                          <TableCell>{totalCredits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  Total Number of Each Course Types and Credits by Semester
                </Typography>
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'><strong>Semester</strong></TableCell>
                        <TableCell align='center'><strong>BC</strong></TableCell>
                        <TableCell align='center'><strong>PCC</strong></TableCell>
                        <TableCell align='center'><strong>PAC</strong></TableCell>
                        <TableCell align='center'><strong>PSE-1</strong></TableCell>
                        <TableCell align='center'><strong>PSE-2</strong></TableCell>
                        <TableCell align='center'><strong>PSE-3</strong></TableCell>
                        <TableCell align='center'><strong>PSE-4</strong></TableCell>
                        <TableCell align='center'><strong>PSE-5</strong></TableCell>
                        <TableCell align='center'><strong>Total Courses</strong></TableCell>
                        <TableCell align='center'><strong>Total Credits</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(coursesBySemester).map(([semester, data]) => (
                        <TableRow key={semester}>
                          <TableCell align='center'>{semester}</TableCell>
                          <TableCell align='center'>{data.BC.count}</TableCell>
                          <TableCell align='center'>{data.PCC.count}</TableCell>
                          <TableCell align='center'>{data.PAC.count}</TableCell>
                          <TableCell align='center'>{data['PSE-1'].count}</TableCell>
                          <TableCell align='center'>{data['PSE-2'].count}</TableCell>
                          <TableCell align='center'>{data['PSE-3'].count}</TableCell>
                          <TableCell align='center'>{data['PSE-4'].count}</TableCell>
                          <TableCell align='center'>{data['PSE-5'].count}</TableCell>
                          <TableCell align='center'>{data.totalCourses}</TableCell>
                          <TableCell align='center'>{data.totalCredits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseStatistics;