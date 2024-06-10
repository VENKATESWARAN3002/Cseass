import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../contexts/AuthContext';
import { ListItem,ListItemIcon,ListItemText,Paper,ListSubheader,Divider,Switch} from '@mui/material';
const StudentSideBar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/student/login');
      };
      
  return (
    <>
    <Paper sx ={{width:200 ,bgcolor:'grey.100'}}>
    <ListItem button component={Link} to="/student/dash">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
    <ListItem button component={Link} to="/student/cregister">
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Course Registration" />
        </ListItem>
        
        <ListItem button component={Link} to="/student/dash/perform">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Performance" />
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

export default StudentSideBar