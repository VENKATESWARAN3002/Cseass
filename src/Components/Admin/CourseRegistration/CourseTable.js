import React , { useState }from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Tooltip,
  Box,
  Snackbar,
  Alert,
  Slide,
  ThemeProvider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2', // Blue color
    },
  
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: theme.shadows ? theme.shadows[3] : 'none', // Providing a fallback value if theme.shadows is undefined
  },
  select: {
    minWidth: 200,
    [theme.breakpoints?.down('sm')]: { // Optional chaining to avoid undefined errors
      minWidth: 120,
    },
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'center',
  },
  removeButton: {
    color: 'red', // Fallback color if theme.palette.error is undefined
  },
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'
  },
  '&.MuiTableCell-body': {
    fontSize: '14px',
  },
}));


const CourseTable = ({ courses, faculties, handleFacultyChange, handleRemoveCourse, initialCourseIds }) => {
  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [removedCourse, setRemovedCourse] = useState('');

  const handleRemoveClick = (courseId, courseName) => {
    handleRemoveCourse(courseId);
    setRemovedCourse(courseName);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
          <CustomTableCell align="center" >Course Code</CustomTableCell>
          <CustomTableCell align="center" >Course Name</CustomTableCell>
          <CustomTableCell align="center" >Course Type</CustomTableCell>
          <CustomTableCell align="center" >Total Credits</CustomTableCell>
          <CustomTableCell align="center" >Faculty</CustomTableCell>
          <CustomTableCell align="center" >Action</CustomTableCell>
          </TableRow>
            </TableHead>
            <TableBody>
            {courses.map((course, index) => (
          <TableRow key={course.id}  sx={{backgroundColor: index % 2 === 0 ? 'rgb(232, 208, 208)' : 'rgb(244, 233, 233)' } }>
             <TableCell align="center">{course.c_code}</TableCell>
             <TableCell align="center">{course.c_name}</TableCell>
             <TableCell align="center">{course.c_type}</TableCell>
             <TableCell align="center">{course.c_TC}</TableCell>
             <TableCell align="center">
             <FormControl fullWidth className={classes.select}>
              <Select
                value={course.faculty_name} // Ensure the selected value is visible in the dropdown
                onChange={(e) => handleFacultyChange(course.c_code, e.target.value)}
              >
                <MenuItem value="">-- Select Faculty --</MenuItem>
                <MenuItem value="Dr. S.MANGAYARCARASSY">Dr. S.MANGAYARCARASSY</MenuItem>
                <MenuItem value=" S. Geetha">S. Geetha</MenuItem>
                <MenuItem value="Guest Faculty">Guest Faculty</MenuItem>
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.fac_name}>
                    {faculty.fac_name}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
              </TableCell>
              <TableCell className={classes.actionCell}>
              {!initialCourseIds.includes(course.id) && (
                <Tooltip title="Remove Course">
                
                  <DeleteIcon sx={{marginTop:2 ,color:'red',cursor:'pointer'}}onClick={() => handleRemoveCourse(course.id)}/>
                </Tooltip>
              )}
             </TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          TransitionComponent={(props) => <Slide {...props} direction="up" />}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {`Course "${removedCourse}" has been removed.`}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CourseTable;
