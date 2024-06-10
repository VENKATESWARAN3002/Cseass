import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Typography, Paper, CircularProgress, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

const ViewStudents = ({ courseId, facultyName }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
     
      if (courseId && facultyName) {
        try {
          const studentsSnapshot = await getDocs(collection(db, 'tbl_Student'));
          const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const enrolledStudents = [];

          for (const student of studentsList) {
            const courseRegRef = collection(db, 'tbl_Student', student.id, 'course_registrations');
            const semesters = ['semesterFirst', 'semesterSecond', 'semesterThird', 'semesterFourth'];

            for (const semester of semesters) {
              const semesterDoc = await getDocs(query(courseRegRef, where('__name__', '==', semester)));
              if (!semesterDoc.empty) {
                const semesterData = semesterDoc.docs[0].data();
                if (semesterData.courses) {
                  semesterData.courses.forEach(course => {
                    if (course.id === courseId && course.faculty_name === facultyName) {
                      enrolledStudents.push(student);
                    }
                  });
                }
              }
            }
          }
          setStudents(enrolledStudents);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Failed to fetch students. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudents();
  }, [courseId, facultyName]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Students in Course: 
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Program</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.register_no}</TableCell>
                <TableCell>{student.std_name}</TableCell>
                <TableCell>{student.std_email}</TableCell>
                <TableCell>{student.program}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ViewStudents;
