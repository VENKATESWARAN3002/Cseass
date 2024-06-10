import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  CircularProgress,
  Avatar,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Drawer,
  AppBar,
  Toolbar,
  CssBaseline,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Switch,
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel'
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';

import AddIcon from '@mui/icons-material/Add';
import Header from '../Admin/CourseRegistration/Header';
import MainHeader from '../../css/assests/MainHeader';
import StudentSideBar from './StudentSideBar';

const StudentDash = () => {
  const { user, logout } = useAuth();
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState({
    std_name: '',
    std_email: '',
    std_phone: '',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your profile photo was updated' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user && user.id) {
        try {
          const studentDocRef = doc(db, 'tbl_Student', user.id);
          const studentDoc = await getDoc(studentDocRef);
          if (studentDoc.exists()) {
            const data = studentDoc.data();
            setStudent(data);
            setStudentData({
              std_name: data.std_name || '',
              std_email: data.std_email || '',
              std_phone: data.std_phone || '',
            });
          } else {
            console.error('No such student document!');
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      }
    };

    fetchStudentData();
  }, [user]);

  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setProfilePhoto(file); // Set the selected file as profile photo
  };
  
  const handleUpload = async () => {
    if (!profilePhoto) {
      console.error('No file selected for upload');
      return;
    }
  
    setLoading(true); // Set loading state to true while uploading
    try {
      const storageRef = ref(storage, `profilePhotos/${user.id}`);
      await uploadBytes(storageRef, profilePhoto); // Upload the file to Firebase Storage
      const photoURL = await getDownloadURL(storageRef);
  
      const studentDocRef = doc(db, 'tbl_Student', user.id);
      await updateDoc(studentDocRef, { photoURL }); // Update Firestore document with the new photo URL
  
      setStudent((prev) => ({ ...prev, photoURL }));
      setSnackbarMessage('Profile photo updated successfully!');
      setSnackbarOpen(true);
      setDialogOpen(false); // Close the dialog after successful upload
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setSnackbarMessage('Failed to upload profile photo.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading state to false after upload completes
      setProfilePhoto(null); // Reset profile photo state
    }
  };
  

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const studentDocRef = doc(db, 'tbl_Student', user.id);
      await updateDoc(studentDocRef, studentData);
      setStudent(studentData);
      setEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const profileCompleteness = () => {
    let completed = 0;
    if (student.std_name) completed += 1;
    if (student.std_email) completed += 1;
    if (student.std_phone) completed += 1;
    if (student.photoURL) completed += 1;
    return (completed / 4) * 100;
  };

  const handleAvatarClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditing(false); // Exit edit mode
    // Reset studentData to the original data fetched from Firestore
    setStudentData({
      std_name: student.std_name || '',
      std_email: student.std_email || '',
      std_phone: student.std_phone || '',
    });
  };
  
  const drawer = (
    <div>
      <Toolbar/>
      <Divider />
      <List sx={{marginTop:15}}>
        <StudentSideBar/>
      </List>
      <Divider />
      <ListSubheader>Settings</ListSubheader>
      <ListItem>
        <ListItemIcon>
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </ListItemIcon>
        <ListItemText primary="Dark Mode" />
      </ListItem>
    </div>
  );

  if (!student) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1,bgcolor: 'grey.100' }}>
        
        <Toolbar >
        <MainHeader/>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleDarkModeToggle}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon  sx={{ color: 'darkblue', ml: 1 }}/>
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
        }}
      >
        <Grid container spacing={3} marginTop={9}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent={
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={handleAvatarClick}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 140,
                        cursor: 'pointer',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      src={profilePhoto ? URL.createObjectURL(profilePhoto) : student.photoURL || ''}
                      alt={student.std_name ? student.std_name.charAt(0) : 'N/A'}
                      onClick={handleAvatarClick}
                    >
                      {!student.photoURL && student.std_name ? student.std_name.charAt(0) : 'N/A'}
                    </Avatar>
                  </Badge>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {student.std_name || 'Student'}
                  </Typography>
                  {editing ? (
                    <Box>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="std_name"
                        label="Name"
                        value={studentData.std_name}
                        onChange={handleInputChange}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        name="std_email"
                        label="Email"
                        value={studentData.std_email}
                        onChange={handleInputChange}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        name="std_phone"
                        label="Phone"
                        value={studentData.std_phone}
                        onChange={handleInputChange}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{ mt: 2 }}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        sx={{ mt: 2 ,marginLeft:2}}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" component="h2" color={'black'}>
                        Email: {student.std_email || 'Not available'}
                      </Typography>
                      <Typography variant="h6" component="h2" color={'black'}>
                        Phone: {student.std_phone || 'Not available'}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                        sx={{ mt: 2 }}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                  )}
                  <Box mt={2}>
                    <Typography variant="body1">Profile Completeness</Typography>
                    <LinearProgress variant="determinate" value={profileCompleteness()} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={notification.message} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Calendar
              </Typography>
              {/* Add your calendar component here */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
  <DialogTitle>Upload Profile Photo</DialogTitle>
  <DialogContent>
    <input
      accept="image/*"
      style={{ display: 'none' }}
      id="upload-dialog-file"
      type="file"
      onChange={handleFileChange} // Call handleFileChange when a file is selected
    />
    <label htmlFor="upload-dialog-file">
      <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
        Choose File
      </Button>
    </label>
    {profilePhoto && (
      <Box mt={2}>
        <img
          src={URL.createObjectURL(profilePhoto)}
          alt="Profile"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
    )}
    {loading && <CircularProgress sx={{ mt: 2 }} />}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleUpload} color="primary"> {/* Call handleUpload when Upload button is clicked */}
      Upload
    </Button>
    <Button onClick={handleDialogClose} color="primary"> {/* Close the dialog when Cancel button is clicked */}
      Cancel
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default StudentDash;
