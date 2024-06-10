import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem, Tooltip, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, CssBaseline, Button, Table, TableBody, TextField, TableCell, TableHead, TableRow, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Snackbar, Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../contexts/AuthContext'; // Ensure correct path to AuthContext
import { db, storage } from '../../firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, listAll, deleteObject } from 'firebase/storage';
import CourseSelector from './CourseSelector'; // Ensure correct path to CourseSelector
import ViewStudents from './ViewStudents'; // Ensure correct path to ViewStudents

const drawerWidth = 240;

const FacultyDash = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [facultyId, setFacultyId] = useState(null); // State to store facultyId
  const [facultyName, setFacultyName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (user && user.fac_email) {
        const userQuery = query(collection(db, 'tbl_faculty'), where('fac_email', '==', user.fac_email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          setFacultyId(userDoc.id); // Set facultyId
          setFacultyName(userData.fac_name); // Set facultyName
        }
      }
    };

    fetchFacultyData();
  }, [user]);

  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (facultyId) {
        const coursesRef = collection(db, 'tbl_faculty', facultyId, 'selected_courses');
        const coursesSnapshot = await getDocs(coursesRef);
        setSelectedCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchSelectedCourses(facultyId, setSelectedCourses, setSelectedCourseId);
  }, [facultyId]);

  const handleLogout = async () => {
    await logout();
    navigate('/faculty/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteCourse = async (courseId) => {
    if (facultyId) {
      try {
        const courseRef = doc(db, 'tbl_faculty', facultyId, 'selected_courses', courseId);
        await deleteDoc(courseRef);
        const coursesSnapshot = await getDocs(collection(db, 'tbl_faculty', facultyId, 'selected_courses'));
        setSelectedCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setSnackbarMessage('Course deleted successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting course: ', error);
      }
    }
  };

  const handleDeleteStudyMaterials = async (courseId) => {
    setSelectedCourseId(courseId);
    setShowDeleteConfirmation(true);
    try {
      const materialsRef = ref(storage, `study_materials/${courseId}`);
      const materialsSnapshot = await listAll(materialsRef);
      const materialsList = materialsSnapshot.items.map(item => ({
        name: item.name,
        fullPath: item.fullPath,
      }));
      setStudyMaterials(materialsList);
      setOpenDeleteDialog(true);
    } catch (error) {
      console.error('Error fetching study materials: ', error);
    }
  };

  const handleDeleteMaterial = async (fullPath) => {
    const fileRef = ref(storage, fullPath);
    try {
      await deleteObject(fileRef);
      setStudyMaterials(studyMaterials.filter(material => material.fullPath !== fullPath));
      setSnackbarMessage('Study material deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting study material: ', error);
    }
  };

  const handleOpenUploadDialog = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `study_materials/${selectedCourseId}/${file.name}`);
    await uploadBytes(storageRef, file);
    handleCloseUploadDialog();
    setSnackbarMessage('Study material uploaded successfully');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleViewStudents = (courseId) => {
    console.log("Selected courseId in FacultyDash:", courseId); // Debug log
    setSelectedCourseId(courseId);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Faculty Dashboard
          </Typography>
          {user && (
            <div>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} color="inherit" sx={{ p: 0 }}>
                  <Avatar alt={user.fac_name} src={user.avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  mt: '45px',
                  '& .MuiMenu-list': {
                    width: '200px',
                    py: '0',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.32)',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar sx={{ width: 120, height: 150 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToAppIcon /> Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/faculty/dash">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/viewStudent">
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="View Students" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/faculty/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>
            Welcome, {user ? user.fac_name : ''}
          </Typography>
          {user && (
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Profile Details
              </Typography>
              <Avatar
                alt={user.fac_name}
                src={user.avatar}
                sx={{ width: 130, height: 150, mb: 2, border: '2px solid #fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
              />
              <TextField
                fullWidth
                label="Name"
                value={user.fac_name}
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Email"
                value={user.fac_email}
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Paper>
          )}
          <CourseSelector facultyId={facultyId} />
          <Typography variant="h6" gutterBottom>
            Selected Courses
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.program}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenUploadDialog(course.id)}>
                      <Tooltip title='Upload the Study Material'>
                        <UploadIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStudyMaterials(course.id)}>
                      <Tooltip title="Delete a Study Materials">
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCourse(course.id)}>
                      <Tooltip title="Delete a Selected Course">
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleViewStudents(course.courseId)}>
                      <Tooltip title="View Students">
                        <VisibilityIcon />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
        <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
          <DialogTitle color={'black'}>Upload Study Material</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To upload study material, please select a file from your device.
            </DialogContentText>
            <input type="file" onChange={handleUpload} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Study Materials</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select study materials to delete.
            </DialogContentText>
            <List>
              {studyMaterials.map(material => (
                <ListItem key={material.fullPath} button onClick={() => handleDeleteMaterial(material.fullPath)}>
                  <ListItemText primary={material.name} />
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
          <DialogTitle>Delete Selected Course</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this selected Course?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirmation(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteCourse} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <ViewStudents courseId={selectedCourseId} facultyName={facultyName} />
      </Box>
    </Box>
  );
};

export default FacultyDash;
