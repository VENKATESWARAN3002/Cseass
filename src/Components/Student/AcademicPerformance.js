import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Paper,
} from '@mui/material';
import Header from '../Admin/CourseRegistration/Header';
import StudentSideBar from './StudentSideBar';
import PerformanceStatistics from './PerformanceStatistics';


const AcademicPerformance = () => {
  const { user } = useAuth();
  const [academicPerformances, setAcademicPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicPerformances = async () => {
      try {
        const performances = [];
        const performanceCollectionRef = collection(db, 'tbl_Student', user.id, 'academic_performance');
        const performanceSnapshot = await getDocs(performanceCollectionRef);

        performanceSnapshot.forEach((performanceDoc) => {
          const performanceData = performanceDoc.data();
          performances.push(performanceData);
        });

        setAcademicPerformances(performances);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching academic performances:', error);
        setError('Failed to load academic performances. Please try again later.');
        setLoading(false);
      }
    };

    fetchAcademicPerformances();
  }, [user]);

  const dataForChart = academicPerformances.map((performance, index) => {
    const prevGPA = index > 0 ? academicPerformances[index - 1].gpa : null;
    const currentGPA = performance.gpa;
    let percentageChange = null;

    if (prevGPA !== null) {
      percentageChange = ((currentGPA - prevGPA) / prevGPA) * 100;
    }

    return {
      name: `Semester ${performance.semester}`,
      GPA: currentGPA,
      percentageChange: percentageChange,
      color: `hsl(${index * 30}, 70%, 50%)`,  // Generate different colors
    };
  });

  const getAverageGPA = () => {
    if (academicPerformances.length === 0) return 0;
    const totalGPA = academicPerformances.reduce((sum, perf) => sum + perf.gpa, 0);
    return (totalGPA / academicPerformances.length).toFixed(2);
  };

  const getHighestGPA = () => {
    return Math.max(...academicPerformances.map((perf) => perf.gpa));
  };

  const getLowestGPA = () => {
    return Math.min(...academicPerformances.map((perf) => perf.gpa));
  };

  const getMostImprovedSemester = () => {
    let maxImprovement = 0;
    let mostImprovedSemester = null;

    for (let i = 1; i < academicPerformances.length; i++) {
      const improvement = academicPerformances[i].gpa - academicPerformances[i - 1].gpa;
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        mostImprovedSemester = academicPerformances[i].semester;
      }
    }

    return mostImprovedSemester;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const averageGPA = getAverageGPA();
  const highestGPA = getHighestGPA();
  const lowestGPA = getLowestGPA();
  const mostImprovedSemester = getMostImprovedSemester();

  return (
    <>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <StudentSideBar />
        <Paper sx={{ width: 1350, bgcolor: 'grey.100' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Academic Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                {academicPerformances.map((performance, index) => (
                  <Card key={index} sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontSize: 14 }}>
                        Semester {performance.semester}
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontSize: 12 }}>Course Code</TableCell>
                            <TableCell sx={{ fontSize: 12 }}>Course Name</TableCell>
                            <TableCell sx={{ fontSize: 12 }}>Grade</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {performance.courses.map((course, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: 12 }}>{course.c_code}</TableCell>
                              <TableCell sx={{ fontSize: 12 }}>{course.c_name}</TableCell>
                              <TableCell sx={{ fontSize: 12 }}>{course.grade}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Typography variant="subtitle2" sx={{ mt: 2, fontSize: 14 }}>
                        GPA: {performance.gpa}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={5}>
                <PerformanceStatistics dataForChart={dataForChart} averageGPA={averageGPA} />
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: 14 }}>
                      Summary
                    </Typography>
                    <Typography variant="body2">Average GPA: {averageGPA}</Typography>
                    <Typography variant="body2">Highest GPA: {highestGPA}</Typography>
                    <Typography variant="body2">Lowest GPA: {lowestGPA}</Typography>
                    <Typography variant="body2">Most Improved Semester: {mostImprovedSemester}</Typography>
                    <Typography variant="body2">Total Semesters: {academicPerformances.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default AcademicPerformance;
