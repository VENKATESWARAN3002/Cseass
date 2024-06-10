import React, { useState, useEffect } from 'react';
import { storage, db } from '../../../firebase'; // Adjust path as necessary
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, collection, addDoc, getDocs, query, deleteDoc } from 'firebase/firestore';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Container, Typography, Box, Snackbar, Alert, Card, CardContent, LinearProgress, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const DropZone = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[400]}`,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
  borderRadius: theme.shape.borderRadius,
}));

const UploadSyllabus = ({ open, onClose, programId: initialProgramId, programName }) => {
  const [programId, setProgramId] = useState(initialProgramId || '');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsSnapshot = await getDocs(collection(db, 'tbl_program'));
        const programsList = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPrograms(programsList);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setSnackbarMessage('Error fetching programs. Please try again.');
        setSnackbarOpen(true);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    if (initialProgramId) {
      setProgramId(initialProgramId);
    }
  }, [initialProgramId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSyllabusFile(file);
    } else {
      setSyllabusFile(null);
      setSnackbarMessage('Please select a PDF file.');
      setSnackbarOpen(true);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSyllabusFile(file);
    } else {
      setSyllabusFile(null);
      setSnackbarMessage('Please select a PDF file.');
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!programId || !syllabusFile) {
      setSnackbarMessage('All fields are required.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const syllabusCollectionRef = collection(doc(db, 'tbl_program', programId), 'syllabus');
      const syllabusQuery = query(syllabusCollectionRef);
      const syllabusSnapshot = await getDocs(syllabusQuery);

      if (!syllabusSnapshot.empty) {
        const existingSyllabusDoc = syllabusSnapshot.docs[0];
        const existingSyllabusData = existingSyllabusDoc.data();
        const existingSyllabusRef = ref(storage, existingSyllabusData.syllabus_file);

        await deleteObject(existingSyllabusRef);
        await deleteDoc(existingSyllabusDoc.ref);
      }

      const storageRef = ref(storage, `syllabus/${programId}/${syllabusFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, syllabusFile);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, (error) => {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Error uploading syllabus. Please try again.');
        setSnackbarOpen(true);
      }, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(syllabusCollectionRef, {
          program_id: programId,
          syllabus_file: downloadURL,
          syllabus_file_name: syllabusFile.name,
          upload_date: new Date().toISOString(),
        });

        setSnackbarMessage('Syllabus uploaded successfully!');
        setSnackbarOpen(true);
        setProgramId('');
        setSyllabusFile(null);
        setUploadProgress(0);
        onClose();
      });
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      setSnackbarMessage('Error uploading syllabus. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Syllabus for {programName}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" disabled>
                <InputLabel>Program</InputLabel>
                <Select value={programId} onChange={(e) => setProgramId(e.target.value)}>
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DropZone 
                onDrop={handleDrop} 
                onDragOver={handleDragOver} 
                isDragActive={Boolean(syllabusFile)}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                    {syllabusFile ? syllabusFile.name : 'Upload PDF'}
                  </Button>
                </label>
                {syllabusFile && (
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    {syllabusFile.name}
                  </Typography>
                )}
              </DropZone>
            </Grid>
            {uploadProgress > 0 && (
              <Grid item xs={12}>
                <Box mt={2}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="textSecondary">{Math.round(uploadProgress)}%</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Upload Syllabus
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default UploadSyllabus;
