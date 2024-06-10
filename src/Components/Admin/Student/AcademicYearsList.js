import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; // Assuming firebase.js is in the same directory

const AcademicYearsList = ({ programData, onYearSelect }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchAcademicYears = async () => {
      setIsLoading(true); // Set loading state to true
      if (!programData) return;

      try {
        const programRef = doc(db, 'tbl_program', programData.id);
        const academicYearsCollection = collection(programRef, 'academic_year');
        const querySnapshot = await getDocs(academicYearsCollection);
        const academicYearsData = querySnapshot.docs.map(doc => doc.data().year); // Assuming "year" field stores year

        setAcademicYears(academicYearsData);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or error
      }
    };

    fetchAcademicYears();
  }, [programData]);

  return (
    <div>
      <h4>Academic Years:</h4>
      {isLoading ? (
        <p>Loading academic years...</p>
      ) : (
        <ul>
          {academicYears.map((year) => (
            <li key={year}>
              <button onClick={() => onYearSelect(year)}>{year}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcademicYearsList;
