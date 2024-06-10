import React, { useState } from "react";
import { db } from "../../firebase";
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import logo from '../ptu-logo.png';
import '../../css/Login.css';

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // Prevent form submission

    const dbref = collection(db, 'tbl_admin');
    try {
      // Combine the email and password checks into a single query
      const adminQuery = query(dbref, where('admin_email', '==', adminEmail), where('admin_password', '==', adminPassword));
      const adminSnapshot = await getDocs(adminQuery);
      const adminArray = adminSnapshot.docs.map((doc) => doc.data());

      if (adminArray.length > 0) {
        alert('Login Successfully');
        navigate(`/admin/dash`); // Redirect to admin dashboard
      } else {
        alert("Check your Email or Password");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <section>
        <div className="form-box">
          <div className="form-value">
            <div className="main-icon">
              <img src={logo} alt="Logo" />
            </div>
            <form onSubmit={login}>
              <h2>Login</h2>
              <div className="inputbox">
                <IonIcon icon={mailOutline} />
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
                <label>Email</label>
              </div>
              <div className="inputbox">
                <IonIcon icon={lockClosedOutline} />
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
                <label>Password</label>
              </div>
              <button className="btn" type="submit">Login</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
