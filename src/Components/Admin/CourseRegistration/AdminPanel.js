import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Container, Box, Typography, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AdminPanel = () => {
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);

  const updateSemesters = (programName) => {
    const programSemesters = {
      'MCA': ['First', 'Second', 'Third', 'Fourth'],
      'M.Tech': ['First', 'Second', 'Third', 'Fourth'],
      'B.Tech(CSE)': ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']
    };

    const semestersForProgram = programSemesters[programName] || [];
    setSemesters(semestersForProgram);
    setSemester(''); // Reset selected semester when program changes
  };

  useEffect(() => {
    const fetchRegistrationTimes = async () => {
      if (!program || !semester) return;

      try {
        const docRef = doc(db, 'registration_times', `${program}_${semester}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStartTime(data.startTime);
          setEndTime(data.endTime);
        } else {
          setStartTime('');
          setEndTime('');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchRegistrationTimes();
  }, [program, semester]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'registration_times', `${program}_${semester}`);
      await setDoc(docRef, {
        startTime,
        endTime,
      });
      setMessage('Registration times updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      setMessage('Failed to update registration times.');
    }
  };

  const fetchStudentDetails = async () => {
    if (!semester) return;
  
    try {
      const studentCollection = collection(db, 'tbl_Student');
      const studentQuery = query(studentCollection, where(`csem${semester}`, '==', 'enrolled'));
      const querySnapshot = await getDocs(studentQuery);
  
      const students = [];
      querySnapshot.forEach((doc) => {
        students.push(doc.data());
      });
  
      // Sort students by register_no
      students.sort((a, b) => a.register_no.localeCompare(b.register_no));
  
      setStudentDetails(students);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };
  
  useEffect(() => {
    fetchStudentDetails();
  }, [semester]);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Set Registration Times
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="program-select-label">Program</InputLabel>
              <Select
                labelId="program-select-label"
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value);
                  updateSemesters(e.target.value);
                }}
              >
                <MenuItem value="MCA">MCA</MenuItem>
                <MenuItem value="M.Tech">M.Tech</MenuItem>
                <MenuItem value="B.Tech(CSE)">B.Tech(CSE)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!program}
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              disabled={!semester}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              disabled={!semester}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!semester || !startTime || !endTime}
            >
              Save
            </Button>
            {message && (
              <Typography variant="body1" color="secondary" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </CardContent>
        </Card>
        
        {studentDetails.length > 0 && (
          <Card sx={{ mb: 4, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Details for {semester} Semester
              </Typography>
              <ul>
                {studentDetails.map((student, index) => (
                  <li key={index}> {student.register_no}-{student.std_name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default AdminPanel;
