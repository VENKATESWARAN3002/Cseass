import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust path as necessary
import { collection, getDocs, doc } from 'firebase/firestore';
import { Container, Typography, Box, CircularProgress, Paper, Grid, Tooltip, Card, CardActionArea, CardContent, Collapse, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import SchoolIcon from '@mui/icons-material/School';

const Root = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const FileIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ProgramPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(2),
}));

const ProgramCard = styled(Card)(({ theme, selected }) => ({
  fontWeight: 'bold',
  display: 'flex',
  flexDirection: 'column',
  color: '#000',
  background: '#fff',
  transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  border: '2px solid transparent',
  padding: theme.spacing(2),
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  ...(selected && {
    background: 'linear-gradient(135deg, #795548, #5d4037)',
    color: '#fff',
    border: `2px solid ${theme.palette.primary.main}`,
  }),
  ...(selected && {
    zIndex: 10,
  }),
}));

const ProgramCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ProgramTitle = styled(Typography)(({ theme }) => ({
  flex: 1,
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const SyllabusList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ViewSyllabus = () => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsSnapshot = await getDocs(collection(db, 'tbl_program'));
        const programsList = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          program_name: doc.data().program_name,
        }));
        setPrograms(programsList);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoading(true);
      try {
        if (selectedProgram) {
          const syllabusCollectionRef = collection(doc(db, 'tbl_program', selectedProgram), 'syllabus');
          const syllabusSnapshot = await getDocs(syllabusCollectionRef);
          const syllabusData = syllabusSnapshot.docs.map(doc => doc.data());
          setSyllabusList(syllabusData);
        } else {
          setSyllabusList([]);
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      }
      setLoading(false);
    };

    fetchSyllabus();
  }, [selectedProgram]);

  const handleProgramChange = (programId) => {
    setSelectedProgram(programId);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return null;

    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon />;
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      return <ImageIcon />;
    } else {
      return <InsertDriveFileIcon />;
    }
  };

  return (
    <Root>
      <Typography variant="h4" gutterBottom>Syllabus</Typography>
      <ProgramPaper elevation={3}>
        <Grid container spacing={5}>
          {programs.map((program) => (
            <Grid item xs={12} key={program.id} marginBottom={10}>
              <Tooltip title="Click to select this program" arrow>
                <CardActionArea onClick={() => handleProgramChange(program.id)}>
                  <ProgramCard selected={selectedProgram === program.id}>
                    <ProgramCardContent>
                      <SchoolIcon fontSize="large" />
                      <ProgramTitle>{program.program_name}</ProgramTitle>
                    </ProgramCardContent>
                    <Collapse in={selectedProgram === program.id}>
                      <SyllabusList>
                        {loading ? (
                          <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress />
                          </Box>
                        ) : (
                          syllabusList.length > 0 ? (
                            <Grid container spacing={2}>
                              {syllabusList.map((syllabus, index) => (
                                <Grid item xs={12} key={index}>
                                  <Paper variant="outlined">
                                    <ListItemStyled 
                                      component="a" 
                                      href={syllabus.syllabus_file} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FileIcon sx={{ color: 'red' }}>
                                        {getFileIcon(syllabus.syllabus_file_name)}
                                      </FileIcon>
                                      <ListItemTextStyled
                                        primary={`Syllabus: ${syllabus.syllabus_file_name}`}
                                        secondary={`Uploaded on: ${new Date(syllabus.upload_date).toLocaleDateString()}`}
                                      />
                                    </ListItemStyled>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography>No syllabus available.</Typography>
                          )
                        )}
                      </SyllabusList>
                    </Collapse>
                  </ProgramCard>
                </CardActionArea>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </ProgramPaper>
    </Root>
  );
};

export default ViewSyllabus;
