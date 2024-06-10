import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, collection, where, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Replace with your Firebase configuration
import AcademicPerformanceList from './AcademicPerformanceList';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import AdminHeader from '../../css/AdminHeader';
import AdminSideBar from '../Admin/AdminSideBar';
function SemPerf() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [program, setProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [gpa, setGpa] = useState(0);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [semesterExists, setSemesterExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const getStudents = async () => {
    const studentsRef = query(collection(db, "tbl_Student"), orderBy('std_name', 'asc'));
    try {
      const querySnapshot = await getDocs(studentsRef);
      const studentOptions = [];
      querySnapshot.forEach((doc) => {
        studentOptions.push({ id: doc.id, std_name: doc.data().std_name, program: doc.data().program });
      });
      setStudents(studentOptions);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("An error occurred. Please try again.");
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

  const updateSemesters = (programName) => {
    const programSemesters = {
      'MCA': ['First', 'Second', 'Third', 'Fourth'],
      'M.Tech': ['First', 'Second', 'Third', 'Fourth'],
      'B.Tech(CSE)': ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']
    };

    const semestersForProgram = programSemesters[programName] || [];
    setSemesters(semestersForProgram);
    setSelectedSemester(''); // Reset selected semester when program changes
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
    getStudents();
    getCourses();
  }, []);

  useEffect(() => {
    getRegisteredCourses();
  }, [selectedSemester, selectedStudent]);

  const addCourse = () => {
    const newCourseList = [...courseList];
    const courseToAdd = courses.find((course) => course.id === selectedCourse);
    if (!courseToAdd) return;

    newCourseList.push({
      courseId: courseToAdd.id,
      c_code: courseToAdd.c_code,
      c_name: courseToAdd.c_name,
      grade: '',
      c_TC: courseToAdd.c_TC
    });
    setSelectedCourse('');
    setCourseList(newCourseList);
    setShowRemoveButton(newCourseList.length > 0);
  };

  const handleGradeChange = (index, grade) => {
    const newRegisteredCourses = [...registeredCourses];
    newRegisteredCourses[index].grade = grade;
    setRegisteredCourses(newRegisteredCourses);

    console.group(`Grade Change for Course ${index + 1}`);
    console.log('Selected Grade:', grade);

    let totalPoints = 0;
    let totalCredits = 0;

    newRegisteredCourses.forEach((course, i) => {
      const gradePoints = getGradePoints(course.grade);
      const c_TC = course.c_TC;
      const coursePoints = gradePoints * c_TC;

      console.log(`Course ${i + 1}: ${course.c_name} (${course.c_code})`);
      console.log('Grade:', course.grade);
      console.log('Grade Points:', gradePoints);
      console.log('Credits:', c_TC);
      console.log('Course Points:', coursePoints);
      console.log('---');

      totalPoints += coursePoints;
      totalCredits += parseFloat(c_TC);
    });

    console.log('Total Points:', totalPoints);
    console.log('Total Credits:', totalCredits);

    const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    console.log('GPA:', gpa);
    console.groupEnd();

    setGpa(gpa);
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

  const removeCourse = (index) => {
    const newCourseList = [...courseList];
    newCourseList.splice(index, 1);
    setCourseList(newCourseList);
    setShowRemoveButton(newCourseList.length > 0);
    calculateGpa(newCourseList); // Recalculate GPA when courses are removed
  };

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    setRegisteredCourses([]);

    if (studentId) {
      const studentDocRef = doc(db, 'tbl_Student', studentId);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        const programName = studentDoc.data().program;
                setProgram(programName);
        updateSemesters(programName);
      }
    } else {
      setProgram('');
      setSemesters([]);
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

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const checkIfPerformanceExists = async (studentId, semester) => {
    const studentDocRef = doc(db, 'tbl_Student', studentId);
    const performanceCollectionRef = collection(studentDocRef, 'academic_performance');
    const performanceQuery = query(performanceCollectionRef, where('semester', '==', semester));
    const querySnapshot = await getDocs(performanceQuery);
    return !querySnapshot.empty;
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

    const performanceData = {
      program,
      semester: selectedSemester,
      courses: registeredCourses.map((course) => ({
        courseId: course.id,
        c_code: course.c_code,
        c_name: course.c_name,
        c_TC: course.c_TC,
        grade: course.grade || '', // Ensure grade is not undefined
      })),
      gpa: parseFloat(gpa),
    };

    // Log the performanceData to the console
    console.log('Performance Data to be stored:', performanceData);

    const studentDocRef = doc(db, 'tbl_Student', selectedStudent);
    const performanceCollectionRef = collection(studentDocRef, 'academic_performance');

    // Validate that all necessary fields are present and not undefined
    const isValid = validatePerformanceData(performanceData);
    if (!isValid) {
      alert('Invalid performance data. Please check the data and try again.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(performanceCollectionRef, performanceData);
      setSnackbarMessage('Performance data stored successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedStudent('');
      setProgram('');
      setRegisteredCourses([]);
    } catch (error) {
      console.error('Error storing performance:', error);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
          {program && (
            <TextField
              label="Program"
              value={program}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          )}
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
      </Box>
      <Box sx={{ mt: 4 }}>
        <AcademicPerformanceList />
      </Box>
    </Container>
    </div>
    </>
  );
}

export default SemPerf;

