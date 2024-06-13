import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, Grid, Typography, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { styled } from '@mui/system';
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import '@fontsource/poppins';
import CourseStatistics from './Course/CourseStatistics';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminProgramStatistics from './Program/Admin ProgramProgramStatistics';

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, ChartTooltip, Legend);

const ALogo = styled('img')({
  width: 120,
  height: 160,
});

const AdminDash = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [options, setOptions] = useState({});
  const [program, setProgram] = useState('MCA'); // Default program

  const fetchTotalStudents = async (program) => {
    const studentCollection = collection(db, 'tbl_Student');
    const studentQuery = query(studentCollection, where('program', '==', program));
    const querySnapshot = await getDocs(studentQuery);
    return querySnapshot.size;
  };

  const fetchEnrollmentData = async (program) => {
    const semesters = ['First', 'Second', 'Third', 'Fourth'];
    const studentCollection = collection(db, 'tbl_Student');
    const enrollmentData = [];

    for (const semester of semesters) {
      const semesterField = `csem${semester}`;
      const studentQuery = query(studentCollection, where(semesterField, '==', 'enrolled'));
      const querySnapshot = await getDocs(studentQuery);
      enrollmentData.push(querySnapshot.size);
    }

    const totalStudents = await fetchTotalStudents(program);

    setData({
      labels: semesters,
      datasets: [{
        label: 'Student Enrollment',
        data: enrollmentData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    });

    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Course Enrollment Statistics for ${program}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: totalStudents,
        },
      },
    });
  };

  useEffect(() => {
    fetchEnrollmentData(program);
  }, [program]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data,
      options,
    });

    setChartInstance(newChartInstance);

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data, options]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout functionality here
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'grey.100' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a href='https://ptuniv.edu.in/' target="_blank" rel="noopener noreferrer">
                <Avatar sx={{ width: 250, height: 150, bgcolor: 'transparent', margin: 1 }}>
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
          <IconButton color="darkblue" onClick={handleMenu}>
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
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 4, color: '#69180d', fontFamily: "Poppins" }}>
          CSE - AAS<br />
          Admin Dashboard
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea component={Link} to="/admin/viewStudent">
                <CardContent sx={{ textAlign: 'center' }}>
                  <ViewListIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h5" component="div">
                    Student Details
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea component={Link} to="/admin/viewFaculty">
                <CardContent sx={{ textAlign: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                  <Typography variant="h5" component="div">
                    Faculty Details
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea component={Link} to="/admin/course">
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Typography variant="h5" component="div">
                    Course Management
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea component={Link} to="/admin/Program">
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Typography variant="h5" component="div">
                    Program Management
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea component={Link} to="/admin/SemPerf">
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChartIcon sx={{ fontSize: 40, color: 'violet' }} />
                  <Typography variant="h5" component="div">
                    Student Performance Management
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChartIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Typography variant="h5" component="div">
                  Course Enrollment Statistics
                </Typography>
                <canvas ref={chartRef} width="400" height="200"></canvas>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={20} sm={10} md={10}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CourseStatistics />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={20} sm={10} md={10}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AdminProgramStatistics />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDash;
