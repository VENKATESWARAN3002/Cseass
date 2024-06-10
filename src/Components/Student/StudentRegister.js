import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { getDocs, addDoc, collection, where, query } from 'firebase/firestore';
import { Box,Avatar, Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import '../../css/Register.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import CustomButton from '../../css/CustomButton';

const theme = createTheme({

  typography: {
    fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans",Arial, sans-serif', 
  },
  palette: {
    primary: {
      main: '#fff', // White in hex
    },
    
  },
});
const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    fontWeight:'bold',
    color: 'rgb(255,153,51)',
  },
}));

const Logo = styled('img')({
  width: 140,
  height: 180,
  position: 'absolute',
  left: '20px',
  top: '20px',
});



const useStyles = makeStyles(() => ({
  root: {
        position:'relative',
         backgroundImage: `url('/ptu_admin_img.jpg')`,
        backgroundSize: 'cover',
        minHeight: '100vh', // Ensure the viewport is filled
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
  },
}));

const StudentRegister = () => {

  const classes = useStyles();
  const [regno, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [stdPassword, setStdPassword] = useState('');
  const [stdCPassword, setStdCPassword] = useState('');
  const [doorNo, setDoorNo] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedProgram, setSelectedProgramName] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const currentYear = new Date().getFullYear();
  const years = [...Array(21)].map((_, i) => currentYear - 10 + i).sort((a, b) => b - a);

  const handleStartYearChange = (event) => {
    setStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setEndYear(event.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^([a-zA-Z0-9_\.]+)@ptuniv\.edu\.in$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const doorNoInput = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const allowedChars = /^[0-9\/]+$/;
      const isDeleteKey = event.key === 'Backspace' || event.key === 'Delete';
      if (!allowedChars.test(event.key) && !isDeleteKey) {
        event.preventDefault();
      }
    };

    const inputElement = doorNoInput.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);

      return () => {
        inputElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleProgramChange = (event) => {
    const selectedProgram = programs.find((program) => program.programId === event.target.value);
    setSelectedProgramId(event.target.value);
    setSelectedProgramName(selectedProgram.programName);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'doorno':
        setDoorNo(value);
        break;
      case 'streetAddress':
        setStreetAddress(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'pincode':
        setPincode(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tbl_program'));
        const programData = querySnapshot.docs.map((doc) => ({
          programId: doc.id,
          programName: doc.data().program_name,
        }));
        setPrograms(programData);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  const validatePasswordMatch = (event) => {
    if (event.target.value !== stdPassword) {
      event.target.setCustomValidity('Passwords do not match!');
    } else {
      event.target.setCustomValidity('');
    }
  };

  const dbref = collection(db, 'tbl_Student');
  const stdRegister = async () => {
    const matchRegNo = query(dbref, where('register_no', '==', regno));
    const matchEmail = query(dbref, where('std_email', '==', stdEmail));

    if (!validateEmail(stdEmail)) {
      alert('Please enter a valid email in the format @ptuniv.edu.in or @ptuniv.edu.in');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert('Check your Phone number, because Phone Number has 10 digits');
      return;
    }

    if (!regno || !name || !dob || !gender || !selectedProgramId || !stdEmail || !phone || !stdPassword || !stdCPassword) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    if (stdPassword !== stdCPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const snapshot = await getDocs(matchEmail);
      const emailMatchArray = snapshot.docs.map((doc) => doc.data());

      const snapshot1 = await getDocs(matchRegNo);
      const regNoMatchArray = snapshot1.docs.map((doc) => doc.data());

      if (regNoMatchArray.length > 0) {
        alert('This Register number is already exists');
      }
      if (emailMatchArray.length > 0) {
        alert('This email is already exists');
      } else {
        const academicYear = `${startYear}-${endYear}`;
        const fullAddress = `No:${doorNo} ${streetAddress}, ${city}, ${state} - ${pincode}`;
        await addDoc(dbref, {
          register_no: regno,
          std_name: name,
          std_dob: dob,
          std_gender: gender,
          program: selectedProgram,
          academic_year: academicYear,
          address: fullAddress,
          std_email: stdEmail,
          std_phone: phone,
          std_password: stdPassword,
          std_Cpassword: stdCPassword,
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
    <div className={classes.root}>
    <ThemeProvider theme={theme}>
    <Box
    >
      <Typography sx={{ position: 'absolute',left: '180px',top: '60px',fontWeight:'bold',fontSize:'60px',fontFamily:'Tw Cen MT Condensed',textTransform:'uppercase',color:'rgb(138,0,69)'}}>ptu</Typography>
      <a href ='https://ptuniv.edu.in/' target="_blank" rel="noopener noreferrer">
      <Logo src="/ptu-logo.png" alt="Logo" />
      </a>
      <Container component="main" maxWidth="md" justifyContent="center">
        <Box
          sx={{
            color: '#fff',
            paddingLeft:2,
            paddingRight:2,
            marginTop: 1,
            marginBottom: 1,
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent',
            borderRadius: 2,
            backdropFilter: 'blur(1px) brightness(60%)',
            boxShadow: 3,
          }}
        >
         
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
           Register 
          </Typography>
          
          <Box component="form"  noValidate sx={{ mt: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField  
                  required
                  fullWidth
                  id="regno"
                  label="Register Number"
                  name="regno"
                  autoComplete="regno"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                  }}
                  InputProps={{ sx: { color:'white'} }} 
                  onChange={(e) => setRegNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  variant="filled"
                  sx={{
                     borderBottomColor: 'white' ,
                     '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                    
                  }}
                  InputProps={{ sx: { color:'white'} }}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="dob"
                  label="Date of Birth"
                  name="dob"
                  type="date" 
                  variant="filled"
                  sx={{
                    '& .MuiOutlinedInput-root': { // Target entire outlined input
                      color: 'white',
                    },'& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                  }}
                  InputLabelProps={{ shrink: true ,sx: { color:'white'} }}
                  onChange={(e) => setDOB(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required >
                  <FormLabel sx={{color:'white'}}>Select Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    variant="filled"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="stdEmail"
                  label="Your PTU Email"
                  name="stdEmail"
                  autoComplete="email"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: { color:'white'} }}
                  onChange={(e) => setStdEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="stdPassword"
                  label="Password"
                  name="stdPassword"
                  type="password"
                  autoComplete="new-password"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={(e) => setStdPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="stdCPassword"
                  label="Confirm Password"
                  name="stdCPassword"
                  type="password"
                  autoComplete="new-password"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={(e) => setStdCPassword(e.target.value)}
                  onInput={(e) => validatePasswordMatch(e)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required
                sx={{
                  '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                  '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                   // Set background color
                }}>
                  <InputLabel id="program-label">Program</InputLabel>
                  <Select
                    labelId="program-label"
                    id="program"
                    value={selectedProgramId}
                    onChange={handleProgramChange}
                    label="Program"
                    variant="filled"
                  >
                    <MenuItem value="">
                      <em>Choose a Program</em>
                    </MenuItem>
                    {programs.map((program) => (
                      <MenuItem key={program.programId} value={program.programId}>
                        {program.programName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required
                sx={{
                  '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                  '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                   // Set background color
                }}>
                  <InputLabel id="startYear-label">Academic Start Year</InputLabel>
                  <Select
                    labelId="startYear-label"
                    id="startYear"
                    value={startYear}
                    onChange={handleStartYearChange}
                    label="Academic Start Year"
                    variant="filled"
                  >
                    <MenuItem value="">
                      <em>-- Select Start Year --</em>
                    </MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required
                sx={{
                  '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                  '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                   // Set background color
                }}>
                  <InputLabel id="endYear-label">Academic End Year</InputLabel>
                  <Select
                    labelId="endYear-label"
                    id="endYear"
                    value={endYear}
                    onChange={handleEndYearChange}
                    label="Academic End Year"
                    variant="filled"
                  >
                    <MenuItem value="">
                      <em>-- Select End Year --</em>
                    </MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  fullWidth
                  id="doorNo"
                  label="Door No"
                  name="doorNo"
                  autoComplete="doorNo"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={handleAddressChange}
                  inputRef={doorNoInput}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  required
                  fullWidth
                  id="streetAddress"
                  label="Street Address"
                  name="streetAddress"
                  autoComplete="street-address"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                    '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                     // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="pincode"
                  label="Pincode"
                  name="pincode"
                  autoComplete="postal-code"
                  variant="filled"
                  type='number'
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' },
                          '& input': {
                            color: 'white',
                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                            '&[type=number]': {
                              MozAppearance: 'textfield',
                            },
                          }, // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Mobile Number"
                  name="phone"
                  autoComplete="tel"
                  variant="filled"
                  type='number'
                  sx={{
                    '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                    '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' },
                          '& input': {
                            color: 'white',
                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                            '&[type=number]': {
                              MozAppearance: 'textfield',
                            },
                          }, // Set background color
                  }}
                  InputProps={{ sx: {color:'white'} }}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={8}>
                <CustomButton onClick={stdRegister}>
                  Register
                </CustomButton>
              </Grid>
              <Grid item xs={12} sx ={{textAlign:'center'}}>
                <Typography>
                  Already Have an Account? <StyledLink to="/student/login">Login</StyledLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
    </ThemeProvider>
    </div>
    </>
  );
};

export default StudentRegister;
