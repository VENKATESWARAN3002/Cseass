import { Avatar, Paper } from '@mui/material';
import { Position } from '@react-pdf-viewer/core';
import React,{useState}from 'react';

const StudentDetails = ({ student }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  return (
    <Paper>
      <div style={{display: 'flex', flexDirection: 'row'}} >
        <div style={{marginBottom:10}}>
      <h2>Student Details</h2>
      <p>Name: {student.std_name}</p>
      <p>Student ID: {student.register_no}</p>
      <p>Email:{student.std_email}</p>
      <p>Batch:{student.academic_year}</p>
      <p>Program: {student.program}</p>
      <p>Department: Computer Science and Engineering</p>
      </div>
      <Avatar  sx={{ width:130,height:160, marginLeft:50}}src={profilePhoto ? URL.createObjectURL(profilePhoto) : student.photoURL || ''}/>
      
      </div>
    </Paper>
   );
};
export default StudentDetails;
