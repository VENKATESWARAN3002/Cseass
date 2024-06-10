import React, { useState } from 'react'
import { db } from '../../firebase'
import { Link } from 'react-router-dom'
import { getDocs, addDoc, collection, where, query } from 'firebase/firestore'
import { Box, Avatar,Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomButton from '../../css/CustomButton';

const theme = createTheme({
  typography: {
    fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
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
    fontWeight: 'bold',
    color: 'rgb(255,153,51)',
  },
}));

/*const Logo = styled('img')({
  width: 140,
  height: 180,
  position: 'absolute',
  left: '20px',
  top: '20px',
});*/

const ALogo = styled('img')({
  width: 120,
  height: 160,

})
const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    backgroundImage: `url('/ptu_admin_img.jpg')`,
    backgroundSize: 'cover',
    minHeight: '100vh', // Ensure the viewport is filled
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const FacultyRegister = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [desgn, setDesgn] = useState('');
  const [spec, setSpec] = useState('');
  const [spez, setSpez] = useState('');
  const [aM, setAM] = useState('');
  const [exp, setExp] = useState('');
  const [facPassword, setFacPassword] = useState('');
  const [facCPassword, setFacCPassword] = useState('');

  const [error, setError] = useState('');
  const handleExpChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setExp(value);
      setError('');
    } else {
      setError('Numbers only allowed');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^([a-zA-Z0-9_.]+)@ptuniv\.edu\.in$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // Matches 10 digits
    return phoneRegex.test(phone);
  };

  const validatePasswordMatch = (event) => {
    if (event.target.value !== facPassword) {
      event.target.setCustomValidity("Passwords do not match!");
    } else {
      event.target.setCustomValidity("");
    }
  };

  const desgnOptions = [
    { label: 'HOD - PROFESSOR', value: 'HOD(PROFESSOR)' },
    { label: 'Professor', value: 'PROFESSOR' }, // Assuming these values match the database
    { label: 'Associate Professor', value: 'ASSOCIATE PROFESSOR' },
    { label: 'Assistant Professor', value: 'ASSISTANT PROFESSOR' },
    { label: 'Programmer', value: 'PROGRAMMER' },
  ];

  const options = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  const dbref = collection(db, "tbl_faculty");

  const facRegister = async () => {
    const matchEmail = query(dbref, where('fac_email', '==', facEmail));

    if (!validateEmail(facEmail)) {
      alert("Please enter a valid email in the format @ptuniv.edu.in ");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert("Check your Phone number, because Phone Number has 10 digits");
      return;
    }

    if (!name || !gender || !facEmail || !facPassword || !facCPassword) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    if (facPassword !== facCPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const snapshot = await getDocs(matchEmail);
      const emailMatchArray = snapshot.docs.map((doc) => doc.data());

      if (emailMatchArray.length > 0) {
        alert("This email already exists");
      } else {
        await addDoc(dbref, {
          fac_name: name,
          fac_dob: dob,
          fac_gender: gender,
          fac_email: facEmail,
          fac_phone: phone,
          fac_desgn: desgn,
          fac_spec: spec,
          fac_spez: spez,
          fac_AM: aM,
          fac_exp: exp,
          fac_password: facPassword,
          fac_Cpassword: facCPassword,
        });
        alert('Registered Successfully');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Box>
            <Container component="main" maxWidth="md" justifyContent="center">
              <Box
                sx={{
                  color: '#fff',
                  paddingLeft: 2,
                  paddingRight: 2,
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
                <a href='https://ptuniv.edu.in/' target="_blank" rel="noopener noreferrer">
                  <Avatar sx={{ width: 250, height: 150, bgcolor: 'transparent' }}>
                    <ALogo src="/ptu-logo.png" alt="Logo" />
                  </Avatar>
                </a>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
                  Register
                </Typography>
                <Box component="form" noValidate sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
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
                          '& .MuiFilledInput-root': { 
                            borderBottom: '2px solid white'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'white',
                          },
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required sx={{'& .MuiFilledInput-root': { 
                            borderBottom: '2px solid white'
                          },
                        '& .MuiInputLabel-root': { color: 'white'}, // Target label text
                      }}>
                        <InputLabel id="desgn-label">Designation</InputLabel>
                        <Select
                          labelId="desgn-label"
                          id="desgn"
                          value={desgn}
                          onChange={(e) => setDesgn(e.target.value)}
                          label="Designation"
                          variant="filled"
                        >
                          <MenuItem value="">
                            <em>Select a Designation</em>
                          </MenuItem>
                          {desgnOptions.map((designation) => (
                            <MenuItem key={designation.value} value={designation.value}>
                              {designation.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                          '& .MuiFilledInput-root': { 
                            borderBottom: '2px solid white'
                          },
                          '& .MuiOutlinedInput-root': { // Target entire outlined input
                            color: 'white',
                          }, 
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                        onChange={(e) => setDOB(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <FormLabel sx={{ color: 'white' }}>Select Gender</FormLabel>
                        <RadioGroup
                          row
                          name="gender"
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
                        id="spec"
                        label="Specifications"
                        name="spec"
                        autoComplete="spec"
                        variant="filled"
                        multiline
                        rows={4}
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setSpec(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="spez"
                        label="Specializations"
                        name="spez"
                        autoComplete="spez"
                        variant="filled"
                        multiline
                        rows={4}
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setSpez(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="aM"
                        label="Alma mater"
                        name="aM"
                        autoComplete="aM"
                        variant="filled"
                        multiline
                        rows={4}
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setAM(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="exp"
                        label="Experience"
                        name="exp"
                        autoComplete="exp"
                        variant="filled"
                        type="text"
                        value={exp}
                        error={!!error}
                        helperText={error}
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
                          },
                        }}
                        onChange={handleExpChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="phone"
                        label="Mobile Number"
                        name="phone"
                        autoComplete="tel"
                        variant="filled"
                        type= 'number'
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
                          },
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="facEmail"
                        label="Your PTU Email"
                        name="facEmail"
                        autoComplete="email"
                        variant="filled"
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setFacEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="facPassword"
                        label="Password"
                        name="facPassword"
                        type="password"
                        autoComplete="new-password"
                        variant="filled"
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setFacPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="facCPassword"
                        label="Confirm Password"
                        name="facCPassword"
                        type="password"
                        autoComplete="new-password"
                        variant="filled"
                        sx={{
                          '& .MuiFilledInput-root': { borderBottom: '2px solid white'},
                          '& .MuiOutlinedInput-root fieldset': { borderColor: 'white' },
                          '& .MuiInputLabel-root': { color: 'white' }, // Target label text
                        }}
                        InputProps={{ sx: { color: 'white' } }}
                        onChange={(e) => setFacCPassword(e.target.value)}
                        onInput={(e) => validatePasswordMatch(e)}
                      />
                    </Grid>
                    
                    <Grid item xs={8}>
                      <CustomButton onClick={facRegister}>
                        Register
                      </CustomButton>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Typography>
                        Already Have an Account? <StyledLink to="/faculty/login">Login</StyledLink>
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
}

export default FacultyRegister;
