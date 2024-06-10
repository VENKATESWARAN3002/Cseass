import React, { useState, useEffect } from 'react';
import {getDocs,collection,query,where,deleteDoc,updateDoc} from 'firebase/firestore';
import { db } from '../../../firebase';
import StudentDetailsModal from '../../Student/StudentDetailsModal';
import UpdateStudentForm from './UpdateStudentForm';
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button,Snackbar,Alert,Slide,Box,Typography,IconButton,TextField,CircularProgress,TablePagination,Checkbox,Dialog,DialogActions,DialogContent, DialogContentText,DialogTitle,Switch,useMediaQuery,useTheme,Tooltip,} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon,Visibility as VisibilityIcon,CheckBox as CheckBoxIcon,CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';

const StudentsList = ({ students = [] }) => {
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredStudents(
      students.filter(
        (student) =>
          student.std_name.toLowerCase().includes(query) ||
          student.register_no.toString().includes(query)
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const viewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowUpdateForm(false);
  };

  const updateStudent = async (updatedStudent) => {
    setLoading(true);
    setUpdateMessage(null);
    try {
      const studentRef = collection(db, 'tbl_Student');
      const studentQuery = query(
        studentRef,
        where('register_no', '==', updatedStudent.register_no)
      );
      const querySnapshot = await getDocs(studentQuery);

      if (querySnapshot.empty) {
        setUpdateMessage('Student not found. Update failed.');
        setLoading(false);
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, updatedStudent);
      setUpdateMessage('Student details updated successfully!');
    } catch (error) {
      setUpdateMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteStudent = async (registerNo) => {
    setLoading(true);
    setDeleteMessage(null);
    try {
      const studentRef = query(
        collection(db, 'tbl_Student'),
        where('register_no', '==', registerNo)
      );
      const snapshot = await getDocs(studentRef);
      if (snapshot.empty) {
        setDeleteMessage('Student not found');
        setLoading(false);
        return;
      }
      const docRef = snapshot.docs[0].ref;
      await deleteDoc(docRef);
      setDeleteMessage('Student details deleted successfully!');
    } catch (error) {
      setDeleteMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(student.register_no)) {
        return prevSelected.filter((id) => id !== student.register_no);
      } else {
        return [...prevSelected, student.register_no];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStudents(filteredStudents.map((student) => student.register_no));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleBatchDelete = async () => {
    setLoading(true);
    try {
      const promises = selectedStudents.map(async (registerNo) => {
        const studentRef = query(
          collection(db, 'tbl_Student'),
          where('register_no', '==', registerNo)
        );
        const snapshot = await getDocs(studentRef);
        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          await deleteDoc(docRef);
        }
      });
      await Promise.all(promises);
      setDeleteMessage('Selected students deleted successfully!');
      setSelectedStudents([]);
    } catch (error) {
      setDeleteMessage('An error occurred during batch delete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{width: '100%', height: '100%',padding: 4,backgroundColor: darkMode ? '#1c1c1c' : '#f5f5f5',color: darkMode ? '#fff' : '#000',borderRadius: 2,boxShadow: 3,}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, }} >
        <Typography variant="h4" gutterBottom>Students</Typography>
        <Box>
          <Typography component="span" sx={{ mr: 1 }}>Dark Mode</Typography>
          <Switch checked={darkMode} onChange={handleToggleDarkMode} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <TextField label="Search by Name or RegNo"  variant="outlined" value={searchQuery} onChange={handleSearch} sx={{ width: isMobile ? '100%' : '50%' }}/>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{borderRadius: 2, boxShadow: 3 ,}}>
            <Table sx={{align:'center'}}>
              <TableHead sx={{ backgroundColor: darkMode ? '#444' : '#e0e0e0',align:'center' }}>
                <TableRow>
                  <TableCell padding="checkbox" style={{ background: 'rgb(166, 34, 34)'}}>
                    <Checkbox icon={<CheckBoxOutlineBlankIcon />}checkedIcon={<CheckBoxIcon />}onChange={handleSelectAll}
                      indeterminate={ selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length }
                      checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length } />
                  </TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>REGISTER NO</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>NAME</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>E-MAIL</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>PHONE</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>DOB</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>GENDER</TableCell>
                  <TableCell align="center" style={{ background: 'rgb(166, 34, 34)',color:'white',fontWeight:'bold'}}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
                <TableRow
                  key={index}
                  sx={{backgroundColor:index % 2 === 0 ? 'rgb(232, 208, 208)' : 'rgb(244, 233, 233)'} }
                  hover
                >
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedStudents.includes(student.register_no)} onChange={() => handleSelectStudent(student)} icon={<CheckBoxOutlineBlankIcon />} checkedIcon={<CheckBoxIcon />} />
                      </TableCell>
                      <TableCell align="center" >{student.register_no}</TableCell>
                      <TableCell align="center" >{student.std_name}</TableCell>
                      <TableCell align="center" >{student.std_email}</TableCell>
                      <TableCell align="center" >{student.std_phone}</TableCell                      >
                      <TableCell align="center" width="200px">{student.std_dob}</TableCell>
                      <TableCell align="center" >{student.std_gender}</TableCell>
                      <TableCell align="center">
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                          <Tooltip title="View">
                              <VisibilityIcon fontSize="small" sx={{ padding: '5px 10px',cursor: 'pointer',color:'rgb(50,46,162)',marginRight:1}} onClick={() => {setSelectedStudent(student); setShowModal(true);}}/>
                          </Tooltip>
                          <Dialog open={openDialog} onClose={handleCloseDialog}>
        <StudentDetailsModal student={student} />
      </Dialog>
                          <Tooltip title="Edit">
                              <EditIcon fontSize="small" sx={{ padding: '5px 10px',cursor: 'pointer',color:'rgb(2,198,53)',marginRight:1}}onClick={() => {setSelectedStudent(student); setShowUpdateForm(true)
                                const modalElement = document.getElementById('Edit-modal');
                                if (modalElement) {
                                  modalElement.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                               />
                          </Tooltip>
                          <Tooltip title="Delete">
                              <DeleteIcon fontSize="small" sx={{ padding: '5px 10px'}} color="error"onClick={() => {setSelectedStudent(student);handleDeleteConfirmation();}}/>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Snackbar
        open={!!updateMessage}
        autoHideDuration={6000}
        onClose={() => setUpdateMessage(null)}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setUpdateMessage(null)}
          severity={updateMessage?.includes('success') ? 'success' : 'error'}
        >
          {updateMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!deleteMessage}
        autoHideDuration={6000}
        onClose={() => setDeleteMessage(null)}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setDeleteMessage(null)}
          severity={deleteMessage?.includes('success') ? 'success' : 'error'}
        >
          {deleteMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete selected students?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBatchDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {showModal && selectedStudent && (
        <Box id="student-modal">
        <StudentDetailsModal  student={selectedStudent} onClose={closeModal} />
        </Box>
      )}
      
      {showUpdateForm && selectedStudent && (
          <Box id='Edit-modal'>
        <UpdateStudentForm
          student={selectedStudent}
          onClose={closeModal}
          onUpdate={updateStudent}
        />
        </Box>
      )}
    </Box>
  );
};

export default StudentsList;

