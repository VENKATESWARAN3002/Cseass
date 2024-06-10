import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableRow, Tabs, Tab, Box, Avatar,styled,TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  title: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  content: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  actions: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}));

const ALogo = styled('img')({
  width: 120,
  height: 180,
});
const CourseDetailsModal = ({ course, onClose, onUpdate }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  // Handle potential scenario where course data is missing
  if (!course) {
    return (
      <Dialog open onClose={onClose}>
       <DialogTitle className={classes.title}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 120, height: 180, bgcolor: 'transparent' }}>
              <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            <Typography variant="h6">Course Details</Typography>
          </Box>
        </DialogTitle>
      </Dialog>
    );
  }

  const processCourseOutcomes = (courseOutcomeString) => {
    // Split by semicolons to separate CO# and explanations
    const outcomes = courseOutcomeString.split(';');
    return outcomes.map((outcome) => {
      // Separate CO# and explanation (assuming colon separates them)
      const [coNumber, explanation] = outcome.split(':');
      return {
        coNumber: coNumber?.trim(), // Extract and trim CO# (optional chaining)
        explanation: explanation?.trim() // Extract and trim explanation
      };
    });
  };

  const courseOutcomes = processCourseOutcomes(course.COs);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
     <DialogTitle className={classes.title}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 160, height: 170, bgcolor: 'transparent' }}>
              <ALogo src="/ptu-logo.png" alt="Logo" />
            </Avatar>
            <Typography variant="h6">Course Details</Typography>
          </Box>
        </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Details" />
          <Tab label="Outcomes" />
          {/*<Tab label="Update" />*/}
        </Tabs>
        {tabIndex === 0 && (
          <Box className={classes.tabContent}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell><b>Course Code:</b></TableCell>
                  <TableCell>{course.c_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Course Name:</b></TableCell>
                  <TableCell>{course.c_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Course Type:</b></TableCell>
                  <TableCell>{course.c_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Program:</b></TableCell>
                  <TableCell>{course.program}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Semester:</b></TableCell>
                  <TableCell>{course.semester}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Total Credits:</b></TableCell>
                  <TableCell>{course.c_TC}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box className={classes.tabContent}>
            <Typography variant="h6">Course Outcomes</Typography>
            <Table className={classes.table} border={1}>
              <TableBody>
                {courseOutcomes.map((outcome, index) => (
                  <TableRow key={index}>
                    <TableCell><b>{outcome.coNumber}</b></TableCell>
                    <TableCell>{outcome.explanation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
        {tabIndex === 2 && (
          <Box className={classes.tabContent}>
            <Typography variant="h6">Update Course</Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedCourse = {
                  c_code: e.target.c_code.value,
                  c_name: e.target.c_name.value,
                  c_type: e.target.c_type.value,
                  program: e.target.program.value,
                  semester: e.target.semester.value,
                  c_TC: e.target.c_TC.value,
                  COs: e.target.COs.value,
                };
                onUpdate(updatedCourse);
                onClose();
              }}
            >
              <TextField fullWidth margin="normal" label="Course Code" name="c_code" defaultValue={course.c_code} />
              <TextField fullWidth margin="normal" label="Course Name" name="c_name" defaultValue={course.c_name} />
              <TextField fullWidth margin="normal" label="Course Type" name="c_type" defaultValue={course.c_type} />
              <TextField fullWidth margin="normal" label="Program" name="program" defaultValue={course.program} />
              <TextField fullWidth margin="normal" label="Semester" name="semester" defaultValue={course.semester} />
              <TextField fullWidth margin="normal" label="Total Credits" name="c_TC" defaultValue={course.c_TC} />
              <TextField
                fullWidth
                margin="normal"
                label="Course Outcomes"
                name="COs"
                defaultValue={course.COs}
                multiline
                rows={4}
              />
              <Button type="submit" color="primary" variant="contained" style={{ marginTop: '16px' }}>
                Update Course
              </Button>
            </form>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailsModal;