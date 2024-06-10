import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore'; // Assuming you have Firebase configured
import { db } from '../../../firebase'; // Replace with your Firebase configuration

const ProgramsList = ({onProgramSelect}) => {
  const [programs, setPrograms] = useState([]); // State to store fetched programs
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Function to fetch programs from Firestore
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const programsCollection = collection(db, 'tbl_program'); // Replace with your program collection name
      const querySnapshot = await getDocs(programsCollection);
      const programData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPrograms(programData);
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., display error message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []); // Fetch programs on component mount

  const onSelect = (programId) => {
    // Handle program selection
    console.log(`Selected program with ID: ${programId}`);
  };

  return (
    <div className='program-list'>
      <h2>Available Programs</h2>
      {isLoading ? (
        <p>Loading programs...</p>
      ) : (
        <ul>
          {programs.map((program) => (
            <li key={program.id}>
              <button onClick={() => onProgramSelect(program)} disabled={isLoading}>
  {program.program_name}
</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramsList;
