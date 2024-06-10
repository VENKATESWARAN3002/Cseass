import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Adjust path as necessary
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Typography, CircularProgress, Paper, Card, CardContent, Grid, Avatar } from '@mui/material';
import CountUp from 'react-countup';

const AdminProgramStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [programStats, setProgramStats] = useState([]);

  useEffect(() => {
    fetchProgramStats();
  }, []);

  const fetchProgramStats = async () => {
    setLoading(true);
    try {
      const programsSnapshot = await getDocs(collection(db, 'tbl_program'));
      const programStatsData = [];
      for (const doc of programsSnapshot.docs) {
        const programName = doc.data().program_name;
        const coursesSnapshot = await getDocs(query(collection(db, 'tbl_course'), where('program', '==', programName)));
        const studentsSnapshot = await getDocs(query(collection(db, 'tbl_Student'), where('program', '==', programName)));
        const numCourses = coursesSnapshot.size;
        const numStudents = studentsSnapshot.size;
        programStatsData.push({ programName, numCourses, numStudents });
      }
      setProgramStats(programStatsData);
    } catch (error) {
      console.error('Error fetching program statistics:', error);
    }
    setLoading(false);
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom marginBottom={4}>Program Statistics</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <Grid container  sx={{alignContent:'center'}}spacing={3} marginLeft={2} marginRight={1}>
            {programStats.map(program => (
              <Grid item xs={12} md={5} key={program.programName}>
                <Card
                  sx={{
                    backgroundColor: '#f5f5f5',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>{program.programName}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card
                          sx={{
                            backgroundColor: '#e0f7fa',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: 6,
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" align="center">Enrolled Students</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center">
                              <Avatar sx={{ backgroundColor: '#00796b', width: 56, height: 56, mr: 2 }}>
                                <Typography variant="h6">
                                  <CountUp end={program.numStudents} duration={1.5} />
                                </Typography>
                              </Avatar>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card
                          sx={{
                            backgroundColor: '#e0f7fa',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: 6,
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" align="center">Total Courses</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center">
                              <Avatar sx={{ backgroundColor: '#00796b', width: 56, height: 56, mr: 2 }}>
                                <Typography variant="h6">
                                  <CountUp end={program.numCourses} duration={1.5} />
                                </Typography>
                              </Avatar>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default AdminProgramStatistics;
