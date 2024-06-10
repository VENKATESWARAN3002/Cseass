import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, where, doc, deleteDoc,updateDoc, } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination,
  TableSortLabel,
  Checkbox,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FacultyDetailsModal from '../Faculty/FacultyDetailsModal';
import UpdateFacultyForm from '../Faculty/UpdateFacultyForm';
import { saveAs } from 'file-saver';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import AdminHeader from '../../css/AdminHeader';
import FacultyStatistics from '../Faculty/FacultyStatistics';
const ViewFaculty = () => {
  const theme = useTheme();
  const[faculty,setFaculty] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchBy, setSearchBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldNames, setFieldNames] = useState({ fac_name: 'Name', fac_desgn: 'Designation', fac_email: 'Email' });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'success', open: false });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderByField, setOrderByField] = useState('fac_name');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [totalExperience, setTotalExperience] = useState(0);
  const [averageExperience, setAverageExperience] = useState(0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setAnchorEl(null);
  };

  const customTheme = createTheme({
    typography: {
      fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
    },
    palette: {
      background: {
        default: '#f5f5f5', // Greyish white
      },
      primary: {
        main: '#795548', // Warm brown
      },
      secondary: {
        main: 'rgb(155, 6, 6)', // Cherry red
      },
    },
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [faculties]);

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const facultiesCollection = collection(db, 'tbl_faculty');
      const q = query(facultiesCollection, orderBy('fac_exp', 'desc'));
      const querySnapshot = await getDocs(q);
      const facultyData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFaculties(facultyData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm || !searchBy) return;
    setIsLoading(true);
    try {
      const facultiesCollection = collection(db, 'tbl_faculty');
      let q = query(facultiesCollection, orderBy('fac_exp', 'desc'));
      if (searchTerm && searchBy) {
        const searchField = searchBy.toLowerCase();
        q = query(facultiesCollection, where(searchField, '==', searchTerm));
      }
      const querySnapshot = await getDocs(q);
      const facultyData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFaculties(facultyData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTermChange = (event) => setSearchTerm(event.target.value);
  const handleSearchByChange = (event) => setSearchBy(event.target.value);
  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const openUpdateModal = (faculty) => {
    setSelectedFaculty(faculty);
    setShowUpdateModal(true);
  };
  const closeUpdateModal = () => setShowUpdateModal(false);
  const handleUpdate = () => {
    setShowUpdateModal(false);
    fetchFaculties();
  };

  const updateFaculty = async (updatedFaculty) => {
    try {
      const FacultyQuery = query(collection(db, 'tbl_faculty',faculty.id));
      const querySnapshot = await getDocs(FacultyQuery);

      if (!querySnapshot.empty) {
        const facultyDocRef = querySnapshot.docs[0].ref;
        await updateDoc(facultyDocRef, updatedFaculty);
        fetchFaculties();
        setSnackbar({ message: 'Faculty Details updated successfully!', severity: 'success', open: true });
      } else {
        setSnackbar({ message: 'Faculty not found.', severity: 'error', open: true });
      }
    } catch (error) {
      setSnackbar({ message: 'Error updating Faculty Details.', severity: 'error', open: true });
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteClick = (facultyId) => {
    setFacultyToDelete(facultyId);
    setShowDeleteConfirmation(true);
  };

  const deleteFaculty = async () => {
    setDeleteMessage(null);
    setShowDeleteConfirmation(false);
    try {
      const facultyDocRef = doc(db, 'tbl_faculty', facultyToDelete);
      await deleteDoc(facultyDocRef);
      setFaculties((prevFaculties) => prevFaculties.filter((faculty) => faculty.id !== facultyToDelete));
      setDeleteMessage('Faculty deleted successfully!');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      setDeleteError('An error occurred. Please try again.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderByField === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderByField(property);
  };

  const calculateStatistics = () => {
    if (faculties.length > 0) {
      const totalExp = faculties.reduce((sum, faculty) => sum + parseFloat(faculty.fac_exp), 0);
      setTotalExperience(totalExp);
      setAverageExperience(totalExp / faculties.length);
    } else {
      setTotalExperience(0);
      setAverageExperience(0);
    }
  };

  const handleSelectFaculty = (event, facultyId) => {
    const selectedIndex = selectedFaculties.indexOf(facultyId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedFaculties, facultyId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedFaculties.slice(1));
    } else if (selectedIndex === selectedFaculties.length - 1) {
      newSelected = newSelected.concat(selectedFaculties.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedFaculties.slice(0, selectedIndex),
        selectedFaculties.slice(selectedIndex + 1),
      );
    }

    setSelectedFaculties(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = faculties.map((n) => n.id);
      setSelectedFaculties(newSelecteds);
      return;
    }
    setSelectedFaculties([]);
  };

  const exportToCSV = (data) => {
    const csvRows = [];
    const headers = ['Name', 'Designation', 'Email', 'DOB', 'Gender', 'Specializations', 'Phone', 'Experience'];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = [
        row.fac_name,
        row.fac_desgn,
        row.fac_email,
        row.fac_dob,
        row.fac_gender,
        row.fac_spec,
        row.fac_phone,
        row.fac_exp
      ];
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'faculties.csv');
  };

  const deleteSelectedFaculties = async () => {
    setDeleteMessage(null);
    setShowDeleteConfirmation(false);
    try {
      for (const facultyId of selectedFaculties) {
        const facultyDocRef = doc(db, 'tbl_faculty', facultyId);
        await deleteDoc(facultyDocRef);
      }
      setFaculties((prevFaculties) => prevFaculties.filter((faculty) => !selectedFaculties.includes(faculty.id)));
      setDeleteMessage('Selected faculties deleted successfully!');
      setSelectedFaculties([]);
    } catch (error) {
      console.error('Error deleting faculties:', error);
      setDeleteError('An error occurred. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
    <AdminHeader 
        handleMenu={handleMenu}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
      <Container>
        <Typography variant="h5" gutterBottom  sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins", marginTop: 1 ,marginLeft:55 }}>
          CSE - AAS : Admin Dashboard <br/>
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#69180d', fontFamily: "Poppins", marginTop: 1, marginLeft:60 }}>
          Faculty Management
        </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          label={`Search by ${fieldNames[searchBy] || 'Select a field'}`}
          value={searchTerm}
          onChange={handleSearchTermChange}
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          select
          value={searchBy}
          onChange={handleSearchByChange}
          variant="outlined"
          fullWidth
          sx={{ marginRight: 2 }}
          label="Search By"
        >
          {Object.keys(fieldNames).map((fieldName) => (
            <MenuItem key={fieldName} value={fieldName}>
              {fieldNames[fieldName]}
            </MenuItem>
          ))}
        </TextField>
      </Paper>
      {isLoading && <CircularProgress sx={{ alignSelf: 'center', my: 4 }} />}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Faculty Statistics
        </Typography>
        <Typography variant="body1">
          Total Faculties: {faculties.length}
        </Typography>
        {/*<Typography variant="body1">
          Total Experience: {totalExperience.toFixed(2)} years
        </Typography>
        <Typography variant="body1">
          Average Experience: {averageExperience.toFixed(2)} years
        </Typography>*/}
      </Paper>
      {/*<Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToCSV(faculties)}
          sx={{ marginRight: 2 }}
          startIcon={<FileDownloadIcon />}
        >
          Export All to CSV
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToCSV(faculties.filter((faculty) => selectedFaculties.includes(faculty.id)))}
          sx={{ marginRight: 2 }}
          startIcon={<FileDownloadIcon />}
          disabled={selectedFaculties.length === 0}
        >
          Export Selected to CSV
        </Button>
      </Paper>*/}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedFaculties.length > 0 && selectedFaculties.length < faculties.length}
                  checked={faculties.length > 0 && selectedFaculties.length === faculties.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all faculties' }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderByField === 'fac_name'}
                  direction={orderByField === 'fac_name' ? order : 'asc'}
                  onClick={() => handleRequestSort('fac_name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderByField === 'fac_desgn'}
                  direction={orderByField === 'fac_desgn' ? order : 'asc'}
                  onClick={() => handleRequestSort('fac_desgn')}
                >
                  Designation
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Qualifications</TableCell>
              <TableCell>Specializations</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderByField === 'fac_exp'}
                  direction={orderByField === 'fac_exp' ? order : 'asc'}
                  onClick={() => handleRequestSort('fac_exp')}
                >
                  Experience
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((faculty) => {
              const isItemSelected = selectedFaculties.indexOf(faculty.id) !== -1;
              return (
                <TableRow
                  key={faculty.id}
                  hover
                  onClick={(event) => handleSelectFaculty(event, faculty.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': faculty.id }}
                    />
                  </TableCell>
                  <TableCell>{faculty.fac_name}</TableCell>
                  <TableCell>{faculty.fac_desgn}</TableCell>
                  <TableCell>{faculty.fac_email}</TableCell>
                  <TableCell>{faculty.fac_dob}</TableCell>
                  <TableCell>{faculty.fac_gender}</TableCell>
                  <TableCell>
                    {Array.isArray(faculty.fac_spec) ? faculty.fac_spec.map((spec, index) => (
                      <Chip key={index} label={spec} sx={{ mr: 1 }} />
                    )) : faculty.fac_spec}
                  </TableCell>
                  <TableCell>{faculty.fac_spez}</TableCell>
                  <TableCell>{faculty.fac_phone}</TableCell>
                  <TableCell>{faculty.fac_exp}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton color="primary" onClick={() => handleViewFaculty(faculty)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update">
                      <IconButton color="secondary" onClick={() => openUpdateModal(faculty)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteClick(faculty.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={faculties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {!isLoading && faculties.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No faculties found.
        </Typography>
      )}
      {showModal && selectedFaculty && (
          <FacultyDetailsModal faculty={selectedFaculty} onClose={() => setShowModal(false)} />
        )}
      
      {showUpdateModal && selectedFaculty && (
      <UpdateFacultyForm
        faculty={selectedFaculty}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={updateFaculty}
      />
    )}
      <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <DialogTitle>Delete Faculty</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this faculty?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteFaculty} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={deleteMessage !== null}
        autoHideDuration={6000}
        onClose={() => setDeleteMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setDeleteMessage(null)} severity="success">
          {deleteMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteError !== null}
        autoHideDuration={6000}
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setDeleteError(null)} severity="error">
          {deleteError}
        </Alert>
      </Snackbar>
      <FacultyStatistics/>
    </Container>
    </ThemeProvider>
  );
};

export default ViewFaculty;
