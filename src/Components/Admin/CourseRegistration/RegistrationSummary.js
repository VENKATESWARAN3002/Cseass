import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Grid, Divider, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import collegeLogo from '../../ptu-logo.png'; // Make sure to replace this with the path to your logo
import studentAvatar from '../../user-2-UK2CIdqi.png'; // Placeholder avatar image
import { styled } from '@mui/system';

const useStyles = makeStyles({
  '@media print': {
    '@page': {
      size: 'A4', // Set default paper size to A4
      margin: '20mm', // Set margins
    },
    'html, body': {
      width: '210mm',
      height: '297mm',
      margin: 0, // Remove default margins
      padding: 0,
      overflow: 'hidden',
      '-webkit-print-color-adjust': 'exact',
    },
    'button, .hideOnPrint': {
      display: 'none',
    },
    'header, footer': {
      display: 'none', // Hide the default browser header and footer
    },
    '.printContainer': {
      pageBreakBefore: 'auto',
      pageBreakAfter: 'auto',
      pageBreakInside: 'avoid',
    },
    '.printRow': {
      pageBreakInside: 'avoid',
    },
  },
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
  signatureSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  table: {
    marginTop: '12px', // Reduce the top margin
    '& th, & td': {
      padding: '8px 12px', // Reduce padding for table cells
      fontSize: '12px', // Reduce font size for table content
    },
  },
  section: {
    marginBottom: '24px',
  },
  detailsPaper: {
    padding: '16px',
  },
  courseTablePaper: {
    padding: '16px',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
  },
  logo: {
    width: '110px',
    height: '140px',
    marginRight: '16px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    marginRight: '16px',
  },
});

const ALogo = styled('img')({
  width: '120px',
  height: '150px',
});

const RegistrationSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { student, registrationData, selectedSemester } = location.state || {};

  if (!student || !registrationData || !selectedSemester) {
    return <Typography variant="h6" color="error">Error: Missing registration details.</Typography>;
  }

  return (
    <div>
      <Container>
        <Paper className={classes.detailsPaper}>
          <div className={classes.header}>
            <img src={collegeLogo} alt="College Logo" className={classes.logo} />
            <Typography variant="h6">
              <strong>PUBLIC TECHNICAL UNIVERSITY<br /> (Erstwhile PEC) <br /> An Autonomous Institution</strong>
            </Typography>
          </div>
          <Divider />
          <Typography variant="h6" gutterBottom textAlign={'center'} marginTop={1}><strong>Student Details</strong></Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <ALogo alt="Student Avatar" src={student.photoURL} className={classes.avatar} />
            </Grid>
            <Grid item xs={5}>
              <Typography><strong>Name:</strong> {student.std_name}</Typography>
              <Typography><strong>Student ID:</strong> {student.register_no}</Typography>
              <Typography><strong>Email:</strong> {student.std_email}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography><strong>Programme:</strong> {student.program}</Typography>
              <Typography><strong>Department:</strong> Computer Science and Engineering</Typography>
              <Typography><strong>Batch:</strong> {student.academic_year}</Typography>
              <Typography><strong>Semester:</strong> {selectedSemester}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <Typography variant="h6" gutterBottom textAlign={'center'} marginTop={1}><strong>Courses Registration Details</strong></Typography>
          <TableContainer component={Paper} className={classes.table}>
          <TableContainer className="printContainer">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid grey' }}>Course Code</TableCell>
                <TableCell sx={{ border: '1px solid grey' }}>Course Name</TableCell>
                <TableCell sx={{ border: '1px solid grey' }}>Credit</TableCell>
                <TableCell sx={{ border: '1px solid grey' }}>Faculty</TableCell>
                <TableCell sx={{ border: '1px solid grey' }}>Faculty Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrationData.courses.map((course) => (
                <TableRow key={course.id} sx={{ borderBottom: '1px solid grey' }}>
                  <TableCell sx={{ border: '1px solid grey' }}>{course.c_code}</TableCell>
                  <TableCell sx={{ border: '1px solid grey' }}>{course.c_name}</TableCell>
                  <TableCell sx={{ border: '1px solid grey' }}>{course.c_TC}</TableCell>
                  <TableCell sx={{ border: '1px solid grey' }}>{course.faculty_name}</TableCell>
                  <TableCell sx={{ border: '1px solid grey' }}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           </TableContainer>
      </TableContainer>
          <Box className={classes.signatureSection} marginTop={6}>
            <Typography fontSize={15}>Class Advisor Signature</Typography>
            <Box width="30px" /> {/* Adding a gap between signatures */}
            <Typography fontSize={15}>Signature of HOD</Typography>
          </Box>
        </Paper>
        <Box mt={2} className={classes.hideOnPrint}>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => window.print()}>Print</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => navigate('/student/cregister')}>Go Back</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default RegistrationSummary;
