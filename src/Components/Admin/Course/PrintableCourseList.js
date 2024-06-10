import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const PrintableCourseList = React.forwardRef(({ courses }, ref) => (
  <div ref={ref}>
    <Typography
      variant="h4"
      gutterBottom
      style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}
    >
      Course List
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Course Code</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Course Name</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Course Type</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Program</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Semester</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: 'rgb(166, 34, 34)', color: '#fff' }}>Course Credit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course.id}
              style={{ backgroundColor: 'rgb(244, 233, 233)' }}
            >
              <TableCell>{course.c_code}</TableCell>
              <TableCell>{course.c_name}</TableCell>
              <TableCell>{course.c_type}</TableCell>
              <TableCell>{course.program}</TableCell>
              <TableCell>{course.semester}</TableCell>
              <TableCell>{course.c_TC}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
));

export default PrintableCourseList;
