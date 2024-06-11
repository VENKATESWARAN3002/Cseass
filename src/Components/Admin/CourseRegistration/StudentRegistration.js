import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection,updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import Header from './Header';
import StudentDetails from './StudentDetails';
import CourseTable from './CourseTable';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import {Container, Box, Typography, Card, CardContent, Button, FormControl, Select, MenuItem, Grid, Stepper, Step, StepLabel, Snackbar, IconButton, List, ListItem, ListItemText, Avatar, Paper } from '@mui/material';
import {  CheckCircle as CheckCircleIcon, Padding } from '@mui/icons-material';
import StudentSideBar from '../../Student/StudentSideBar';
const stepsForNotRegistered = ['Select Semester', 'Choose Courses', 'Review & Submit'];
const stepsForRegistered = ['Select Semester', 'Print Page'];


const StudentRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [student, setStudent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState({});
  const [additionalCourses, setAdditionalCourses] = useState([]);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [disableAdditionalCourses, setDisableAdditionalCourses] = useState(false);
  const [additionalCoursesBySemester, setAdditionalCoursesBySemester] = useState({});
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);
  const steps = isAlreadyRegistered ? stepsForRegistered : stepsForNotRegistered;

  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleSnackbarClose = () => setSnackbarOpen(false);
 
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        console.error('User is not authenticated or user ID is undefined!');
        return;
      }

      try {
        // Fetch student data
        const studentDocRef = doc(db, 'tbl_Student', user.id);
        const studentDoc = await getDoc(studentDocRef);

        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          setStudent(studentData);

          // Fetch courses and extract unique semesters
          const courseCollection = collection(db, 'tbl_course');
          const courseQuery = query(courseCollection, orderBy('c_code'));
          const courseQuerySnapshot = await getDocs(courseQuery);
          const courseList = courseQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAllCourses(courseList);

          const uniqueSemesters = [...new Set(courseList.map((course) => course.semester))];
          setSemesters(uniqueSemesters);

          // Fetch faculty data
          const facultyCollection = collection(db, 'tbl_faculty');
          const facultyQuery = query(facultyCollection, orderBy('fac_name'));
          const facultySnapshot = await getDocs(facultyQuery);
          const facultyList = facultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setFaculties(facultyList);

          // Check if registration is open
          const registrationStart = new Date('2024-05-29T00:00:00'); // Example start time
          const registrationEnd = new Date('2024-06-15T23:59:59'); // Example end time
          const currentTime = new Date();

          if (currentTime >= registrationStart && currentTime <= registrationEnd) {
            setRegistrationOpen(true);
          } else {
            setRegistrationOpen(false);
          }
        } else {
          console.error('No such student document!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedSemester) {
      if (selectedSemester === 'Fourth') {
        const filtered = allCourses.filter((course) => course.semester === selectedSemester && course.c_type !== 'PCC');
        setFilteredCourses(filtered);
      } else {
        const filtered = allCourses.filter((course) => course.semester === selectedSemester && course.c_type === 'PCC');
        setFilteredCourses(filtered);
      }

      // Check if the student is already registered for the selected semester
      const checkRegistration = async () => {
        const studentDocRef = doc(db, 'tbl_Student', user.id);
        const registrationDocRef = doc(studentDocRef, 'course_registrations', `semester${selectedSemester}`);
        const registrationDoc = await getDoc(registrationDocRef);

        if (registrationDoc.exists()) {
          setIsAlreadyRegistered(true);
          setRegisteredData(registrationDoc.data()); // Set the registered data
        } else {
          setIsAlreadyRegistered(false);
          setRegisteredData(null); // Clear the registered data
        }
      };

      checkRegistration();
    }
  }, [selectedSemester, allCourses, user]);

  useEffect(() => {
    const isPSE1Selected = additionalCourses.some((course) => course.c_type === 'PSE-1');
    const isPSE2Selected = additionalCourses.some((course) => course.c_type === 'PSE-2');

    if (additionalCourses.length === 2 || (isPSE1Selected && isPSE2Selected)) {
      setDisableAdditionalCourses(true);
    } else {
      setDisableAdditionalCourses(false);
    }
  }, [additionalCourses]);

  useEffect(() => {
    // Initialize additional courses for each semester
    const initialAdditionalCourses = {};
    semesters.forEach((semester) => {
      initialAdditionalCourses[semester] = [];
    });
    setAdditionalCoursesBySemester(initialAdditionalCourses);
  }, [semesters]);

  const handleFacultyChange = (courseCode, facultyName) => {
    const updatedCourses = allCourses.map((course) =>
      course.c_code === courseCode ? { ...course, faculty_name: facultyName } : course
    );
    setAllCourses(updatedCourses);

    setSelectedFaculties({
      ...selectedFaculties,
      [courseCode]: facultyName,
    });
  };

  const handleAdditionalCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = allCourses.find((course) => course.id === selectedCourseId);

    if (selectedCourse) {
      const semester = selectedSemester;
      const additionalCoursesForSemester = additionalCoursesBySemester[semester] || [];
      const isPSE3Selected = additionalCoursesForSemester.some((course) => course.c_type === 'PSE-3');
      const isPSE4Selected = additionalCoursesForSemester.some((course) => course.c_type === 'PSE-4');
      const isPSE5Selected = additionalCoursesForSemester.some((course) => course.c_type === 'PSE-5');

      if (semester === 'Second') {
        const isPSE1Selected = additionalCoursesForSemester.some((course) => course.c_type === 'PSE-1');
        const isPSE2Selected = additionalCoursesForSemester.some((course) => course.c_type === 'PSE-2');

        if ((selectedCourse.c_type === 'PSE-1' && isPSE1Selected) || (selectedCourse.c_type === 'PSE-2' && isPSE2Selected)) {
          alert('You can only select one course of each type (PSE-1 and PSE-2) for the second semester.');
          return;
        }

        if (additionalCoursesForSemester.length >= 2) {
          alert('You can only select two additional courses for the second semester.');
          return;
        }
      }

      if (semester === 'Third') {
        if (selectedCourse.c_type === 'PSE-3' && isPSE3Selected) {
          alert('You can only select one PSE-3 course for the third semester.');
          return;
        }
      }

      if (semester === 'Fourth') {
        if (selectedCourse.c_type === 'PSE-4' && isPSE4Selected) {
          alert('You can only select one PSE-4 course for the fourth semester.');
          return;
        }
      }

     

      setAdditionalCoursesBySemester({
        ...additionalCoursesBySemester,
        [semester]: [...additionalCoursesBySemester[semester], selectedCourse],
      });
    }
  };

  const handleRemoveCourse = (courseId) => {
    const updatedCourses = (additionalCoursesBySemester[selectedSemester] || []).filter((course) => course.id !== courseId);
    setAdditionalCoursesBySemester({
      ...additionalCoursesBySemester,
      [selectedSemester]: updatedCourses,
    });
  };

  const validateForm = () => {
    if (selectedSemester === 'Second') {
      const isPSE1Selected = (additionalCoursesBySemester[selectedSemester] || []).some((course) => course.c_type === 'PSE-1');
      const isPSE2Selected = (additionalCoursesBySemester[selectedSemester] || []).some((course) => course.c_type === 'PSE-2');
      if (!isPSE1Selected || !isPSE2Selected) {
        alert('You must select one PSE-1 course and one PSE-2 course for the second semester.');
        return false;
      }
    }

    if (selectedSemester === 'Third') {
      const isPSE3Selected = (additionalCoursesBySemester[selectedSemester] || []).some((course) => course.c_type === 'PSE-3');
      const isPSE4Selected = (additionalCoursesBySemester[selectedSemester] || []).some((course) => course.c_type === 'PSE-4');
      const isPSE5Selected = (additionalCoursesBySemester[selectedSemester] || []).some((course) => course.c_type === 'PSE-5');
      if (!isPSE3Selected || !isPSE4Selected || !isPSE5Selected) {
        alert('You must select one PSE-3, one PSE-4, and one PSE-5 course for the third semester.');
        return false;
      }
    }



    const allCoursesForSemester = [...filteredCourses, ...(additionalCoursesBySemester[selectedSemester] || [])];
    for (const course of allCoursesForSemester) {
      if (!selectedFaculties[course.c_code]) {
        alert(`Please select a faculty for the course ${course.c_code} - ${course.c_name}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const registrationData = {
      studentId: user.id,
      semester: selectedSemester,
      courses: [...filteredCourses, ...(additionalCoursesBySemester[selectedSemester] || [])].map((course) => ({
        id: course.id,
        c_code: course.c_code,
        c_name: course.c_name,
        c_TC: course.c_TC,
        faculty_name: selectedFaculties[course.c_code] || '',
      })),
    };
  
    if (user && user.id) {
      try {
        const studentDocRef = doc(db, 'tbl_Student', user.id);
        const registrationDocRef = doc(studentDocRef, 'course_registrations', `semester${selectedSemester}`);
  
        // Check if the document already exists for the selected semester
        const registrationDoc = await getDoc(registrationDocRef);
  
        if (registrationDoc.exists()) {
          alert(`Registration for semester ${selectedSemester} already exists.`);
          return;
        }
  
        // Save the selected faculties and additional courses for each course to Firestore
        await setDoc(registrationDocRef, registrationData);
  
        // Update the student's enrollment status for the semester
        const updateData = {};
        updateData[`csem${selectedSemester}`] = 'enrolled'; // Set the field for the semester to 'enrolled'
        await updateDoc(studentDocRef, updateData);
  
        alert('Registration successful!');
        navigate('/student/cregister/print', { state: { student, registrationData, selectedSemester } });
      } catch (error) {
        console.error('Error submitting registration:', error);
        alert('Failed to submit registration.');
      }
    } else {
      alert('User is not authenticated.');
    }
  };
  
  

  if (!student || !user) {
    return <div>Loading...</div>;
  }

  const initialCourseIds = filteredCourses.map(course => course.id);
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <StudentSideBar/>
      <Container>
      <Paper sx={{padding:4,backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',}}>
        <Typography variant="h4" gutterBottom sx={{textAlign:'center'}}>
          Course Registration
        </Typography>    
      <Typography variant="h4" gutterBottom>
          Student Details
        </Typography>
        <Card sx={{ mb: 4, p: 2 }}>
            <StudentDetails student={student} />
        </Card>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {registrationOpen ? (
          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
            <Paper>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                {semesters.map((semester) => (
                    <Grid item xs={12} sm={3} md={2.8} key={semester} marginBottom={1} marginRight={1} marginLeft={1}>
                    <Card
                        onClick={() => setSelectedSemester(semester)}
                        sx={{
                        cursor: 'pointer',
                        border: selectedSemester === semester ? '2px solid #3f51b5' : '1px solid #ddd',
                        boxShadow: selectedSemester === semester ? '0 3px 5px 2px rgba(63, 81, 181, .3)' : 'none',
                        transition: 'all 0.3s ease-in-out',
                        backgroundColor: selectedSemester === semester ? '#f0f0f0' : 'white',
                        '&:hover': {
                            boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                        },
                        }}
                    >
                        <CardContent>
                        <Typography variant="h6" align="center">
                            Semester {semester}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Grid>
                ))}
                </Grid>
            </Paper>
            )}

{activeStep === 1 && !isAlreadyRegistered && selectedSemester && (
                <Card sx={{ mt: 2, mb: 2 }}>
                    <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Courses for {selectedSemester} Semester
                    </Typography>
                    <CourseTable
                                    courses={
                                    selectedSemester === '4'
                                        ? allCourses.filter((course) => course.semester === 'Fourth' && course.c_type !== 'PCC')
                                        : selectedSemester === '2'
                                        ? [
                                            ...allCourses.filter((course) => course.semester === 'Second' && course.c_type === 'PSE-1').slice(0, 1),
                                            ...allCourses.filter((course) => course.semester === 'Second' && course.c_type === 'PSE-2').slice(0, 1),
                                            ...filteredCourses,
                                            ...(additionalCoursesBySemester[selectedSemester] || []),
                                            ]
                                        : [...filteredCourses, ...(additionalCoursesBySemester[selectedSemester] || [])]
                                    }
                                    faculties={faculties}
                                    selectedFaculties={selectedFaculties}
                                    handleFacultyChange={handleFacultyChange}
                                    handleRemoveCourse={handleRemoveCourse}
                                    initialCourseIds={initialCourseIds} // Pass initialCourseIds to CourseTable
                                />

                                {selectedSemester !== 'Fourth' && (
                                    <FormControl fullWidth>
                                    <Typography variant="h6" gutterBottom>
                                        Selected Additional Courses:
                                    </Typography>
                                    <Select
                                        labelId="additional-courses-label"
                                        id="additionalCourses"
                                        onChange={handleAdditionalCourseChange}
                                        disabled={disableAdditionalCourses}
                                    >
                                        <MenuItem value="">
                                        <em>Select an additional course</em>
                                        </MenuItem>
                                        {allCourses
                                        .filter(
                                            (course) =>
                                            course.semester === selectedSemester &&
                                            course.c_type !== 'PCC' &&
                                            !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.id === course.id) &&
                                            (course.c_type !== 'PSE-1' || !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.c_type === 'PSE-1')) &&
                                            (course.c_type !== 'PSE-2' || !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.c_type === 'PSE-2')) &&
                                            (course.c_type !== 'PSE-3' || !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.c_type === 'PSE-3')) &&
                                            (course.c_type !== 'PSE-4' || !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.c_type === 'PSE-4')) &&
                                            (course.c_type !== 'PSE-5' || !additionalCoursesBySemester[selectedSemester].some((addedCourse) => addedCourse.c_type === 'PSE-5'))
                                        )
                                        .map((course) => (
                                            <MenuItem key={course.id} value={course.id}>
                                            {course.c_code} - {course.c_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    </FormControl>
                                )}

                    </CardContent>
                </Card>
                )}
                {activeStep === steps.length - 1 && (
                <Card sx={{ mt: 2, mb: 2 }}>
                    <CardContent>
                    <Typography variant="body1">
                        {isAlreadyRegistered
                        ? `Course registration is completed for semester ${selectedSemester}.`
                        : 'Review your selected courses and submit your registration.'}
                    </Typography>
                    {isAlreadyRegistered && (
                        <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                            navigate('/student/cregister/print', { state: { student, selectedSemester, registrationData: registeredData } })
                            }
                            sx={{ mt: 2 }}
                        >
                            Go to Print Page
                        </Button>
                        </Box>
                    )}
                    </CardContent>
                </Card>
                )}
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                {activeStep !== 0 && (
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  sx={{ ml: 1 }}
                  type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
          </form>
        ) : (
          <p>Registration is currently closed.</p>
        )}
      </Paper>
      </Container>
      </div>
    </div>
  );
};

export default StudentRegistration;
