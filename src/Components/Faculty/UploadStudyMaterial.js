import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';
import { doc, collection, setDoc } from 'firebase/firestore';

const UploadStudyMaterial = ({ courseId ,facultyName}) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const fileRef = ref(storage, `study_materials/${courseId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);
      const courseDocRef = doc(db, 'tbl_course', courseId);
      const studyMaterialsRef = collection(courseDocRef, 'study_materials');

      // Create a new document for the study material
      await setDoc(doc(studyMaterialsRef), {
        facultyName,
        uploadDateTime: new Date().toISOString(), // Store current date and time
        materialName:file.name,
        description,
        fileURL,
      });

      alert('Study material uploaded successfully');
    } else {
      alert('Please select a file to upload');
    }
  };

  const handleDeleteMaterial = async (fileName) => {
    const fileRef = ref(storage, `study_materials/${courseId}/${fileName}`);
    await deleteObject(fileRef);
    // Handle post-delete actions like notifying the user or updating the state
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadStudyMaterial;
