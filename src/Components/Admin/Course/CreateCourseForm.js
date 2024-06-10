import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../../firebase";
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const CreateCourseForm = ({ open, onClose, fetchCourses }) => {
  const [cCode, setCCode] = useState('');
  const [cName, setCName] = useState('');
  const [cType, setCType] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedProgramName, setSelectedProgramName] = useState('');
  const [semester, setSemester] = useState('');
  const [cTC, setCTC] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState([{ id: 1, text: '' }]);
  const [programs, setPrograms] = useState([]);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isCodeDuplicate, setIsCodeDuplicate] = useState(false);
  const [snackbar, setSnackbarState] = useState({ open: false, message: '', severity: 'info' });
  const [suggestedOutcomes, setSuggestedOutcomes] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tbl_program"));
        const programData = querySnapshot.docs.map((doc) => ({
          programId: doc.id,
          programName: doc.data().program_name,
        }));
        setPrograms(programData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, []);

  const handleProgramChange = (event) => {
    const selectedProgram = programs.find((program) => program.programId === event.target.value);
    setSelectedProgramId(event.target.value);
    setSelectedProgramName(selectedProgram.programName);
  };

  const courseTypes = [
    { label: "PCC - Program Core Course", value: "PCC" },
    { label: "PAC - Program Activity Course", value: "PAC" },
    { label: "PSE-1 - Program Specific Elective Course 1", value: "PSE-1" },
    { label: "PSE-2 - Program Specific Elective Course 2", value: "PSE-2" },
    { label: "PSE-3 - Program Specific Elective Course 3", value: "PSE-3" },
    { label: "PSE-4 - Program Specific Elective Course 4", value: "PSE-4" },
    { label: "PSE-5 - Program Specific Elective Course 5", value: "PSE-5" },
    { label: "BC - Bridge Course", value: "BC" },
  ];

  const Sems = [
    { label: "I", value: "First" },
    { label: "II", value: "Second" },
    { label: "III", value: "Third" },
    { label: "IV", value: "Fourth" },
  ];

  const handleCOChange = (index, event) => {
    const newCourseOutcomes = [...courseOutcomes];
    newCourseOutcomes[index].text = event.target.value;
    setCourseOutcomes(newCourseOutcomes);
  };

  const addCourseOutcome = () => {
    setCourseOutcomes([...courseOutcomes, { id: courseOutcomes.length + 1, text: '' }]);
  };

  const removeCourseOutcome = (index) => {
    const newCourseOutcomes = courseOutcomes.filter((_, i) => i !== index);
    setCourseOutcomes(newCourseOutcomes);
  };

  const handleCourseCodeChange = async (event) => {
    const code = event.target.value;
    setCCode(code);

    if (code) {
      setIsCheckingCode(true);

      const dbref = collection(db, "tbl_course");
      const matchCourseCode = query(dbref, where('c_code', '==', code));

      try {
        const snapshot1 = await getDocs(matchCourseCode);
        const courseCodeMatchArray = snapshot1.docs.map((doc) => doc.data());
        setIsCodeDuplicate(courseCodeMatchArray.length > 0);
      } catch (error) {
        console.error('Error checking course code:', error);
      } finally {
        setIsCheckingCode(false);
      }
    } else {
      setIsCodeDuplicate(false);
    }
  };

  const clearForm = () => {
    setCCode('');
    setCName('');
    setCType('');
    setSelectedProgramId('');
    setSelectedProgramName('');
    setSemester('');
    setCTC('');
    setCourseOutcomes([{ id: 1, text: '' }]);
  };

  const courseReg = async () => {
    if (!cCode || !cName || !cType || !selectedProgramId || !semester || !cTC || courseOutcomes.some(co => !co.text)) {
      setSnackbarState({ message: "Please fill in all mandatory fields.", severity: "error", open: true });
      return;
    }

    if (isCodeDuplicate) {
      setSnackbarState({ message: "This Course Code already exists.", severity: "error", open: true });
      return;
    }

    const dbref = collection(db, "tbl_course");

    try {
      const courseOutcomeText = courseOutcomes.map(co => `CO${co.id}:${co.text}`).join('; ');
      await addDoc(dbref, {
        c_code: cCode,
        c_name: cName,
        c_type: cType,
        program: selectedProgramName,
        semester: semester,
        c_TC: cTC,
        COs: courseOutcomeText,
      });
      setSnackbarState({ message: "Course created successfully!", severity: "success", open: true });
      fetchCourses();
      clearForm();
      onClose();
    } catch (error) {
      setSnackbarState({ message: error.message, severity: "error", open: true });
      console.error('Error creating course:', error);
    }
  };

  const predefinedOutcomes = {
    PCC: ["Understand core concepts", "Apply knowledge in practical scenarios", "Analyze case studies"],
    PAC: ["Participate in activities", "Develop teamwork skills", "Enhance communication"],
    PSE1: ["Gain specialized knowledge", "Research specific topics", "Develop advanced skills"],
    BC: ["Bridge foundational knowledge", "Prepare for advanced courses", "Understand basic principles"],
  };

  useEffect(() => {
    if (cType && predefinedOutcomes[cType]) {
      setSuggestedOutcomes(predefinedOutcomes[cType]);
    } else {
      setSuggestedOutcomes([]);
    }
  }, [cType]);

  const toggleSuggestedOutcome = (outcome) => {
    const isSelected = courseOutcomes.some(co => co.text === outcome);
    if (isSelected) {
      setCourseOutcomes(courseOutcomes.filter(co => co.text !== outcome));
    } else {
      setCourseOutcomes([...courseOutcomes, { id: courseOutcomes.length + 1, text: outcome }]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle style={{ backgroundColor: '#8B4513', color: '#FFFFFF' }}>Create Course</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <TextField
                label="Course Code"
                value={cCode}
                onChange={handleCourseCodeChange}
                fullWidth
                required
                sx={{marginTop:1}}
                error={isCodeDuplicate}
                helperText={isCodeDuplicate ? "This course code already exists." : ""}
                InputProps={{
                  endAdornment: isCheckingCode && <CircularProgress size={20} />,
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Course Name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                select
                label="Course Type"
                value={cType}
                onChange={(e) => setCType(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="">Select a Course Type</MenuItem>
                {courseTypes.map((courseType) => (
                  <MenuItem key={courseType.value} value={courseType.value}>
                    {courseType.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box mb={2}>
              <TextField
                select
                label="Program"
                value={selectedProgramId}
                onChange={handleProgramChange}
                fullWidth
                required>
                <MenuItem value="">Select a Program</MenuItem>
                {programs.map((program) => (
                  <MenuItem key={program.programId} value={program.programId}>
                    {program.programName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box mb={2}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Select Semester</FormLabel>
                <RadioGroup row value={semester} onChange={(e) => setSemester(e.target.value)}>
                  {Sems.map((sem) => (
                    <FormControlLabel
                      key={sem.value}
                      value={sem.value}
                      control={<Radio />}
                      label={sem.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                label="Total Credits"
                type="number"
                value={cTC}
                onChange={(e) => setCTC(e.target.value)}
                fullWidth
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Course Outcomes</Typography>
            {courseOutcomes.map((co, index) => (
              <Box key={co.id} display="flex" alignItems="center" mb={2}>
                <TextField
                  label={`Course Outcome-${co.id}`}
                  multiline
                  rows={2}
                  value={co.text}
                  onChange={(event) => handleCOChange(index, event)}
                  fullWidth
                  sx={{ marginRight: 1, marginTop: 2 }}
                  required
                />
                <Tooltip title="Remove Outcome">
                  <RemoveIcon onClick={() => removeCourseOutcome(index)} disabled={courseOutcomes.length === 1} sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Box>
            ))}
            <Button variant="outlined" onClick={addCourseOutcome} startIcon={<AddIcon />}>
              Add Course Outcome
            </Button>
            {/*suggestedOutcomes.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1">Suggested Outcomes</Typography>
                <List>
                  {suggestedOutcomes.map((outcome, index) => (
                    <ListItem key={index} dense button onClick={() => toggleSuggestedOutcome(outcome)}>
                      <Checkbox
                        edge="start"
                        checked={courseOutcomes.some(co => co.text === outcome)}
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText primary={outcome} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )*/}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={clearForm} color="secondary">
          Clear
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={courseReg} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbarState({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbarState({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreateCourseForm;