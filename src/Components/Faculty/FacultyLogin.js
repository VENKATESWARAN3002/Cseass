import React, { useState } from "react";
import { db } from '../../firebase';
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, where, query } from 'firebase/firestore';
import { IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext'; // Ensure correct path to AuthContext
import '../../css/Login.css';
import logo from '../ptu-logo.png';

const FacultyLogin = () => {
  const [facEmail, setFacEmail] = useState('');
  const [facPassword, setFacPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const dbref = collection(db, 'tbl_faculty');
    try {
      const facultyQuery = query(dbref, where('fac_email', '==', facEmail), where('fac_password', '==', facPassword));
      const facultySnapshot = await getDocs(facultyQuery);
      const facultyArray = facultySnapshot.docs.map((doc) => doc.data());
      if (facultyArray.length > 0) {
        alert('Login Successfully');
        setUser(facultyArray[0]); // Set the user in AuthContext
        navigate('/faculty/dash');
      } else {
        alert("Check your Email or Password");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section>
      <div className="form-box">
        <div className="form-value">
          <div className="main-icon">
            <img src={logo} alt="Logo" />
          </div>
          <form>
            <h2>Login</h2>
            <div className="inputbox">
              <IonIcon icon={mailOutline} />
              <input type="email" onChange={(e) => setFacEmail(e.target.value)} />
              <label>Email</label>
            </div>
            <div className="inputbox">
              <IonIcon icon={lockClosedOutline} />
              <input type="password" onChange={(e) => setFacPassword(e.target.value)} />
              <label>Password</label>
            </div>
            <button className="btn" onClick={login}>Login</button>
            <div className="register">
              <p>
                Are you new Faculty? <Link to='/faculty/register'>Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FacultyLogin;
