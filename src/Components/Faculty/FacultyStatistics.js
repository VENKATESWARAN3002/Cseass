import React, { useState,useEffect } from 'react';
import { Paper, Typography, Grid, Avatar, CircularProgress } from '@mui/material';
import { teal, purple, orange, blue, red, green } from '@mui/material/colors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import CountUp from 'react-countup';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
const FacultyStatistics = () => {
    const theme = useTheme();

    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ message: '', severity: 'success', open: false });
    
    useEffect(() =>{
        fetchFaculties();
    },[]);

    const fetchFaculties= async () => {
        setIsLoading(true);
        try {
          const facultySnapshot = await getDocs(
            query(collection(db, 'tbl_faculty'), orderBy('fac_exp', 'desc'))
          );
          const facultyList = facultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setFaculties(facultyList);
        } catch (error) {
          console.error('Error fetching Faculties:', error);
          setSnackbar({ message: 'Error fetching Faculties.', severity: 'error', open: true });
        } finally {
          setIsLoading(false);
        }
      };
    const calculateStatistics = () => {
    if (!faculties || faculties.length === 0) {
      return {
        totalFaculties: 0,
        totalProfessors: 0,
        totalAssociateProfessors: 0,
        totalAssistantProfessors: 0,
        totalMaleFaculties: 0,
        totalFemaleFaculties: 0,
      };
    }

    const totalFaculties = faculties.length;
    const totalProfessors = faculties.filter(faculty => faculty.fac_desgn === 'PROFESSOR' || faculty.fac_desgn === 'HOD - PROFESSOR').length;
    const totalAssociateProfessors = faculties.filter(faculty => faculty.fac_desgn==='ASSOCIATE PROFESSOR').length;
    const totalAssistantProfessors = faculties.filter(faculty => faculty.fac_desgn.includes('Assistant Professor')).length;
    const totalMaleFaculties = faculties.filter(faculty => faculty.fac_gender === 'M').length;
    const totalFemaleFaculties = faculties.filter(faculty => faculty.fac_gender === 'F').length;

    return {
      totalFaculties,
      totalProfessors,
      totalAssociateProfessors,
      totalAssistantProfessors,
      totalMaleFaculties,
      totalFemaleFaculties,
    };
  };

  const {
    totalFaculties,
    totalProfessors,
    totalAssociateProfessors,
    totalAssistantProfessors,
    totalMaleFaculties,
    totalFemaleFaculties,
  } = calculateStatistics();

  const genderData = [
    { name: 'Male', value: totalMaleFaculties },
    { name: 'Female', value: totalFemaleFaculties },
  ];

  const designationData = [
    { name: 'Professors', value: totalProfessors },
    { name: 'Associate Professors', value: totalAssociateProfessors },
    { name: 'Assistant Professors', value: totalAssistantProfessors },
  ];

  const COLORS = [teal[400], purple[400], orange[400], blue[400], red[400], green[400]];

  return (
    <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
        Faculty Statistics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Overall
          </Typography>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Avatar sx={{ bgcolor: blue[500], width: 56, height: 56 }}>{totalFaculties}</Avatar>
            </Grid>
            <Grid item>
              <Typography variant="body1">Total Faculties</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Gender Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Grid container justifyContent="center" spacing={2}>
            {genderData.map((data, index) => (
              <Grid item key={index}>
                <Typography variant="body2">
                  <span style={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>
                    {data.name}
                  </span>: {data.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Designation Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={designationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {designationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Grid container justifyContent="center" spacing={2}>
            {designationData.map((data, index) => (
              <Grid item key={index}>
                <Typography variant="body2">
                  <span style={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>
                    {data.name}
                  </span>: {data.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FacultyStatistics;
