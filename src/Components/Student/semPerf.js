import React, { useState, useEffect } from 'react';
import { getDocs, setDoc, collection, where, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Replace with your Firebase configuration
import AcademicPerformanceList from './AcademicPerformanceList';
import {
  Container, Typography, FormControl, InputLabel, Select,
  Grid, Tooltip, CardActionArea, Card, CardContent, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, CircularProgress, Snackbar, Alert, Box,
} from '@mui/material';
import AdminHeader from '../../css/AdminHeader';
import AdminSideBar from '../Admin/AdminSideBar';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

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

function SemPerf() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [program, setProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false); // added on [5.8.24]
  const [programs, setPrograms] = useState([]);  // added on [5.8.24]
  const [selectedYear, setSelectedYear] = useState(null);  // added on [5.8.24]
  const [selectedProgram, setSelectedProgram] = useState(null);  // added on [5.8.24]
  const [academicYears, setAcademicYears] = useState([]);  // added on [5.8.24]
  const [academic_year,setAcademicYear] =useState(' ');  // added on [5.8.24]
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [gpa, setGpa] = useState(0);
  const [cgpa, setCgpa] = useState(0); // added on [5.8.24]
  const [totalCredits, setTotalCredits] = useState(0); // added on [5.8.24]
  const [totalPoints, setTotalPoints] = useState(0); // added on [5.8.24]
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [semesterExists, setSemesterExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // added on [5.8.24]
  useEffect(() => {
    fetchPrograms();
  }, []);

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

  const fetchStudentDetails = async (programName, academicYear) => {
    setIsLoading(true);
  
    console.log('Fetching student details for:', { programName, academicYear }); // Logging
  
    try {
      let studentQuery;
  
      // Validate programName before creating the query
      if (!programName) {
        throw new Error('programName is undefined');
      }
  
      if (academicYear) {
        // Validate academicYear before using it in the query
        if (!academicYear) {
          throw new Error('academicYear is undefined');
        }
  
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
        setStudents([]); // Clear the students if none are found
        return;
      }
  
      const studentData = studentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
  
  const fetchSemesters = async (programName) => {
    const programSemesters = {
      'MCA': ['First', 'Second', 'Third', 'Fourth'],
      'M.Tech': ['First', 'Second', 'Third', 'Fourth'],
      'B.Tech(CSE)': ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']
    };

    const semestersForProgram = programSemesters[programName] || [];
    setSemesters(semestersForProgram);
    setSelectedSemester('');
  };

  const handleProgramSelect = async (programData) => {
    setSelectedProgram(programData);
    setSelectedYear(null);
    setStudents([]);
    await fetchAcademicYears(programData.program_name);
    await fetchStudentDetails(programData.program_name);
  };
  

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    if (selectedProgram) {
      await fetchStudentDetails(selectedProgram.program_name, year);
    } else {
      console.error('No program selected');
    }
  };
  

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    if (studentId) {
      const studentDocRef = doc(db, 'tbl_Student', studentId);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        const programName = studentDoc.data().program;
        const academic_year = studentDoc.data().academic_year;
        setProgram(programName);
        setAcademicYear(academic_year);
        await fetchSemesters(programName);
        // Assuming calculateCgpa is defined elsewhere
        await calculateCgpa(studentId);
      }
    } else {
      setProgram('');
      setSemesters([]);
      setSelectedSemester('');
      setCgpa(0);
    }
  };

  const getCourses = async () => {
    const coursesRef = query(collection(db, "tbl_course"), orderBy("c_code", 'asc'));
    try {
      const querySnapshot = await getDocs(coursesRef);
      const courseOptions = [];
      querySnapshot.forEach((doc) => {
        courseOptions.push({ id: doc.id, c_code: doc.data().c_code, c_name: doc.data().c_name, semester: doc.data().semester, c_TC: doc.data().c_TC });
      });
      setCourses(courseOptions);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("An error occurred. Please try again.");
    }
  };


  const getRegisteredCourses = async () => {
    if (!selectedStudent || !selectedSemester) return;

    try {
      const studentDocRef = doc(db, 'tbl_Student', selectedStudent);
      const registrationDocRef = doc(studentDocRef, 'course_registrations', `semester${selectedSemester}`);
      const registrationDoc = await getDoc(registrationDocRef);

      let registeredCourses = [];
      if (registrationDoc.exists()) {
        registeredCourses = registrationDoc.data().courses || [];
      }
      else{
        alert('Course registraton for this semester is not enrolled by the selected student.');
      }

      // Fetch courses with 'F' grade from previous semesters
      const previousSemesterCourses = await getPreviousSemesterFCourses(selectedStudent, selectedSemester);
      const combinedCourses = [...registeredCourses, ...previousSemesterCourses];

      setRegisteredCourses(combinedCourses.map(course => ({ ...course, grade: '' })));
    } catch (error) {
      console.error('Error fetching registered courses:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const getPreviousSemesterFCourses = async (studentId, currentSemester) => {
    const semesterIndex = semesters.indexOf(currentSemester);
    const previousSemesters = semesters.slice(0, semesterIndex);

    const fCourses = [];
    for (const semester of previousSemesters) {
      const studentDocRef = doc(db, 'tbl_Student', studentId);
      const performanceCollectionRef = collection(studentDocRef, 'academic_performance');
      const performanceQuery = query(performanceCollectionRef, where('semester', '==', semester));
      const querySnapshot = await getDocs(performanceQuery);

      querySnapshot.forEach((doc) => {
        const courses = doc.data().courses || [];
        courses.forEach((course) => {
          if (course.grade === 'F') {
            fCourses.push(course);
          }
        });
      });
    }
    return fCourses;
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    getRegisteredCourses();
  }, [selectedSemester, selectedStudent]);

  const handleGradeChange = (index, grade) => {
    const newRegisteredCourses = [...registeredCourses];
    newRegisteredCourses[index].grade = grade;
    setRegisteredCourses(newRegisteredCourses);

    

    let totalPoints = 0;
    let totalCredits = 0;
    let earnedCredits = 0;

    newRegisteredCourses.forEach((course, i) => {
      const gradePoints = getGradePoints(course.grade);
      const c_TC = parseFloat(course.c_TC);
      const coursePoints = gradePoints * c_TC;
      totalPoints += coursePoints;
      totalCredits += parseFloat(c_TC);

      if (course.grade !== 'F') {
        earnedCredits += c_TC;
      }
    });
    const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpa(gpa);
    setTotalCredits(earnedCredits);
    setTotalPoints(totalPoints);
  };

  const getGradePoints = (grade) => {
    switch (grade) {
      case 'S': return 10.0;
      case 'A': return 9.0;
      case 'B': return 8.0;
      case 'C': return 7.0;
      case 'D': return 6.0;
      case 'E': return 5.0;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  const handleChangeSemester = async (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    if (selectedStudent && semester) {
      const performanceExists = await checkIfPerformanceExists(selectedStudent, semester);
      setSemesterExists(performanceExists);
    }
  };

  const checkIfPerformanceExists = async (studentId, semester) => {
    const studentDocRef = doc(db, 'tbl_Student', studentId);
    const performanceCollectionRef = collection(studentDocRef, 'academic_performance');
    const performanceQuery = query(performanceCollectionRef, where('semester', '==', semester));
    const querySnapshot = await getDocs(performanceQuery);
    return !querySnapshot.empty;
  };

  const validatePerformanceData = (data) => {
    console.log('Validating performance data:', data); // Log the data being validated
    if (!data.program || !data.semester || !data.courses || data.courses.length === 0 || isNaN(data.gpa)) {
      return false;
    }

    for (const course of data.courses) {
      if (!course.courseId || !course.c_code || !course.c_name || !course.c_TC || course.grade === undefined) {
        console.error('Invalid course data:', course); // Log invalid course data
        return false;
      }
    }

    return true;
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedStudent || registeredCourses.length === 0) {
        alert('Please select a student and add courses!');
        setLoading(false);
        return;
    }

    const performanceExists = await checkIfPerformanceExists(selectedStudent, selectedSemester);
    if (performanceExists) {
        alert('Performance data for this semester already exists for the selected student.');
        setLoading(false);
        return;
    }

    // Calculate current semester total points and credits
    let currentTotalPoints = 0;
    let currentTotalCredits = 0;

    registeredCourses.forEach(course => {
        const gradePoints = getGradePoints(course.grade);
        const coursePoints = gradePoints * parseFloat(course.c_TC);
        currentTotalPoints += coursePoints;
        currentTotalCredits += parseFloat(course.c_TC);
    });

    const currentGpa = currentTotalCredits ? (currentTotalPoints / currentTotalCredits).toFixed(2) : 0;

    // Fetch previous performance data and calculate CGPA including current semester
    const calculateCgpaIncludingCurrentSemester = async () => {
        const studentDocRef = doc(db, 'tbl_Student', selectedStudent);
        const performanceCollectionRef = collection(studentDocRef, 'academic_performance');

        try {
            const performanceQuery = await getDocs(performanceCollectionRef);
            let totalCredits = currentTotalCredits;
            let totalPoints = currentTotalPoints;

            performanceQuery.forEach((doc) => {
                const data = doc.data();
                totalCredits += parseFloat(data.totalCredits || 0);
                totalPoints += parseFloat(data.totalPoints || 0);
            });

            const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
            return cgpa;
        } catch (error) {
            console.error('Error calculating CGPA:', error);
            return 0;
        }
    };

    const cgpa = await calculateCgpaIncludingCurrentSemester();

    const performanceData = {
        program,
        academic_year,
        semester: selectedSemester,
        courses: registeredCourses.map((course) => ({
            courseId: course.id,
            c_code: course.c_code,
            c_name: course.c_name,
            c_TC: course.c_TC,
            grade: course.grade || '',
        })),
        gpa: parseFloat(currentGpa),
        cgpa: parseFloat(cgpa),
        totalPoints: currentTotalPoints,
        totalCredits: currentTotalCredits,
        timestamp: new Date()
    };

    // Log the performanceData to the console
    console.log('Performance Data to be stored:', performanceData);

    const studentDocRef = doc(db, 'tbl_Student', selectedStudent);
    const performanceCollectionRef = doc(studentDocRef, 'academic_performance',`semester${selectedSemester}`);

    // Validate that all necessary fields are present and not undefined
    const isValid = validatePerformanceData(performanceData);
    if (!isValid) {
        alert('Invalid performance data. Please check the data and try again.');
        setLoading(false);
        return;
    }

    try {
        await setDoc(performanceCollectionRef, performanceData);
        setSnackbarMessage('Performance data stored successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setSelectedStudent('');
        setProgram('');
        setRegisteredCourses([]);
        await calculateCgpa(selectedStudent); // Recalculate CGPA for display purposes
    } catch (error) {
        console.error('Error storing performance:', error);
        setSnackbarMessage('An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    } finally {
        setLoading(false);
    }
};

  const calculateGpa = (courseList) => {
    let totalPoints = 0;
    let totalCredits = 0;

    courseList.forEach(course => {
      const gradePoints = getGradePoints(course.grade);
      totalPoints += gradePoints * course.c_TC;
      totalCredits += parseFloat(course.c_TC);
    });

    const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpa(gpa);
  };

  const calculateCgpa = async (studentId) => {
    const studentDocRef = doc(db, 'tbl_Student', studentId);
    const performanceCollectionRef = collection(studentDocRef, 'academic_performance');

    try {
      const performanceQuery = await getDocs(performanceCollectionRef);
      let totalCredits = 0;
      let totalPoints = 0;

      performanceQuery.forEach((doc) => {
        const data = doc.data();
        totalCredits += parseFloat(data.totalCredits || 0);
        totalPoints += parseFloat(data.totalPoints || 0);
      });

      const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
      setCgpa(cgpa);
    } catch (error) {
      console.error('Error calculating CGPA:', error);
    }
  };

  //added on 5.8.24
  return (
    <>
    <AdminHeader/>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
    <AdminSideBar/>
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Semester Performance
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
        {/* Newly Added */}
        </Box>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select value={selectedStudent} onChange={handleStudentChange}>
              <MenuItem value="">
                <em>-- Select Student --</em>
              </MenuItem>
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.std_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {program && semesters.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Semester</InputLabel>
              <Select value={selectedSemester} onChange={handleChangeSemester}>
                <MenuItem value="">
                  <em>-- Select Semester --</em>
                </MenuItem>
                {semesters.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {semesterExists && (
            <Typography color="error" variant="body2">
              Performance data for this semester already exists for the selected student.
            </Typography>
          )}
          {!registeredCourses && (
            <Typography color="error" variant="body2">
             Course registraton for this semester is not enrolled by the selected student.
            </Typography>
          )}
          {!semesterExists && registeredCourses.length > 0 && (
            <div>
              <Typography variant="h6" component="h2" gutterBottom>
                Registered Courses
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Code</TableCell>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Credits</TableCell>
                      <TableCell>Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registeredCourses.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell>{course.c_code}</TableCell>
                        <TableCell>{course.c_name}</TableCell>
                        <TableCell>{course.c_TC}</TableCell>
                        <TableCell>
                          <Select
                            value={course.grade}
                            onChange={(e) => handleGradeChange(index, e.target.value)}
                          >
                            <MenuItem value="">
                              <em>-- Select Grade --</em>
                            </MenuItem>
                            <MenuItem value="S">S</MenuItem>
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                            <MenuItem value="C">C</MenuItem>
                            <MenuItem value="D">D</MenuItem>
                            <MenuItem value="E">E</MenuItem>
                            <MenuItem value="F">F</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  GPA: {gpa}
                </Typography>
                <Typography variant="h6">
                  CGPA: {cgpa}
                </Typography>
                <Typography variant="h6">
                  Total Points: {totalPoints}
                </Typography>
                <Typography variant="h6">
                  Total Credits: {totalCredits}
                </Typography>
              </Box>
            </div>
          )}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Save Performance'}
            </Button>
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      <Box sx={{ mt: 4 }}>
        <AcademicPerformanceList />
      </Box>
    </Container>
    </div>
    </>
  );
}

export default SemPerf;

