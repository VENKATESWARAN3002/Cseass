// src/components/CourseSelector.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FormControl, InputLabel, Select, MenuItem, Button, Grid, Typography, Card, CardContent, CircularProgress, Paper, IconButton, Modal, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: 16, // Use numeric values for padding
  margin: 'auto',
  marginBottom: 16, // Use numeric values for marginBottom
  maxWidth: 600,
  background: 'linear-gradient(to right, #bdc3c7, #2c3e50)',
  color: 'white',
}));

const MandatoryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: 16, // Use numeric values for marginBottom
  color: '#f39c12',
}));

const SelectiveTitle = styled(Typography)(({ theme }) => ({
  marginBottom: 16, // Use numeric values for marginBottom
  color: '#27ae60',
}));

const CardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  border: '2px solid transparent', // Add border style
  '&.selected': {
    border: '2px solid #2196f3', // Highlight selected card
  },
  padding: theme.spacing(1),
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CourseSelector = ({ facultyId }) => {
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // Add state for selected course
  const [open, setOpen] = useState(false); // State for modal open/close
  const [courseDetails, setCourseDetails] = useState(null); // State for course details

  useEffect(() => {
    console.log(`facultyId passed to CourseSelector: ${facultyId}`);
  }, [facultyId]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const programsCollection = collection(db, 'tbl_program');
      const programSnapshot = await getDocs(programsCollection);
      setPrograms(programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'tbl_course');
      const courseSnapshot = await getDocs(coursesCollection);
      setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchPrograms();
    fetchCourses();
  }, []);

  const updateSemesters = (programName) => {
    const programSemesters = {
      'MCA': ['First', 'Second', 'Third', 'Fourth'],
      'M.Tech': ['First', 'Second', 'Third', 'Fourth'],
      'B.Tech(CSE)': ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']
    };
    setSemesters(programSemesters[programName] || []);
    setSelectedSemester(''); // Reset semester selection when program changes
    setSelectedCourseId(null); // Reset selected course when program changes
    setAvailableCourses([]); // Reset available courses when program changes
  };

  const handleProgramChange = (event) => {
    const selectedProgramName = event.target.value;
    setSelectedProgram(selectedProgramName);
    updateSemesters(selectedProgramName);
  };

  const handleSemesterChange = (event) => {
    const selectedSemesterName = event.target.value;
    setSelectedSemester(selectedSemesterName);
    const filteredCourses = courses.filter(course => course.program === selectedProgram && course.semester === selectedSemesterName);
    setAvailableCourses(filteredCourses);
    setSelectedCourseId(null); // Reset selected course when semester changes
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleViewDetails = (courseId) => {
    const course = courses.find(course => course.id === courseId);
    setCourseDetails(course);
    setOpen(true);
  };

  const handleSelectButtonClick = async () => {
    if (!selectedCourseId) {
      console.error('No course selected.');
      return; // Exit early if no course is selected
    }

    const selectedCourse = courses.find(course => course.id === selectedCourseId);
    if (!selectedCourse) {
      console.error('Selected course not found.');
      return; // Exit early if selected course is not found
    }

    if (!selectedSemester || !selectedProgram) {
      console.error('Semester or program not selected.');
      return; // Exit early if semester or program is not selected
    }
    if (!facultyId) {
        console.error('Faculty ID is missing.');
        return;
      }
    try {
      const facultyRef = doc(db, 'tbl_faculty', facultyId);
      await setDoc(doc(collection(facultyRef, 'selected_courses')), {
        courseId: selectedCourse.id,
        c_code:selectedCourse.c_code,
        c_name: selectedCourse.c_name,
        semester: selectedSemester,
        program: selectedProgram
      });
      console.log('Selected course saved successfully.');
      // Optionally, reset the selection
      setSelectedCourseId(null);
    } catch (error) {
      console.error('Error saving selected course:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Select Courses for a Semester</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="program-select-label">Program</InputLabel>
          <Select
            labelId="program-select-label"
            value={selectedProgram}
            onChange={handleProgramChange}
            label="Program"
          >
            {programs.map((program) => (
              <MenuItem key={program.id} value={program.program_name}>
                {program.program_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" disabled={!selectedProgram}>
          <InputLabel id="semester-select-label">Semester</InputLabel>
          <Select
            labelId="semester-select-label"
            value={selectedSemester}
            onChange={handleSemesterChange}
            label="Semester"
          >
            {semesters.map((semester, index) => (
              <MenuItem key={index} value={semester}>
                {semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Available Courses</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <PaperStyled>
              <MandatoryTitle variant="h6">
                Mandatory Courses
              </MandatoryTitle>
              <Grid container spacing={2}>
                {availableCourses.filter(course => course.c_type === 'PCC').map(course => (
                  <Grid key={course.id} item xs={12} sm={6} md={4} lg={3}>
                    <CardStyled
                      className={selectedCourseId === course.id ? 'selected' : ''}
                      onClick={() => handleCourseSelection(course.id)}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {course.c_name}
                        </Typography>
                        <IconButton onClick={() => handleViewDetails(course.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </CardContent>
                    </CardStyled>
                  </Grid>
                ))}
              </Grid>
            </PaperStyled>
            <PaperStyled>
              <SelectiveTitle variant="h6">
                Selective Courses and Bridge Course
              </SelectiveTitle>
              <Grid container spacing={2}>
                {availableCourses.filter(course => course.c_type !== 'PCC').map(course => (
                  <Grid key={course.id} item xs={12} sm={6} md={4} lg={3}>
                    <CardStyled
                      className={selectedCourseId === course.id ? 'selected' : ''}
                      onClick={() => handleCourseSelection(course.id)}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {course.c_name}
                        </Typography>
                        <IconButton onClick={() => handleViewDetails(course.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </CardContent>
                    </CardStyled>
                  </Grid>
                ))}
              </Grid>
            </PaperStyled>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSelectButtonClick}
          disabled={!selectedCourseId || !selectedSemester || !selectedProgram}
        >
          Select Course
        </Button>
      </Grid>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Course Details
          </Typography>
          {courseDetails && (
            <div>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                Name: {courseDetails.c_name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Type: {courseDetails.c_type}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Credits: {courseDetails.c_credit}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Description: {courseDetails.c_desc}
              </Typography>
            </div>
          )}
        </Box>
      </Modal>
    </Grid>
  );
};

export default CourseSelector;
