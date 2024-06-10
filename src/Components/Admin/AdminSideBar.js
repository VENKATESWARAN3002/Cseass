import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList'
import PeopleIcon from '@mui/icons-material/People'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../../contexts/AuthContext';
import { ListItem,ListItemIcon,ListItemText,Paper} from '@mui/material';
const AdminSideBar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/student/login');
      };
      
  return (
    <>
    <Paper sx ={{width:200 ,bgcolor:'grey.100'}}>
    <ListItem button component={Link} to="/admin/dash">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
    <ListItem button component={Link} to="/admin/viewStudent">
          <ListItemIcon>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="Student Details" />
        </ListItem>
        <ListItem button component={Link} to="/admin/viewFaculty">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Faculty Details" />
        </ListItem>
        <ListItem button component={Link} to="/admin/course">
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Course Management" />
        </ListItem>
        <ListItem button component={Link} to="/admin/Program">
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Program Management" />
        </ListItem>
        <ListItem button component={Link} to="/admin/semPerf">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Student Performance Management" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        </Paper>
        </>
  )
}

export default AdminSideBar