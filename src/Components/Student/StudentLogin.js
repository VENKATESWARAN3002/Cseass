// src/components/StudentLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase';
import { Link } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { getDocs, collection, where, query } from 'firebase/firestore';
import logo from '../ptu-logo.png';
import '../../css/Login.css';
import { useAuth } from '../../contexts/AuthContext';

const StudentLogin = () => {
    const [stdEmail, setStdEmail] = useState('');
    const [stdPassword, setStdPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const login = async (e) => {
        e.preventDefault();
        const dbref = collection(db, 'tbl_Student');
        try {
            const q = query(dbref, where('std_email', '==', stdEmail), where('std_password', '==', stdPassword));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userData = { id: userDoc.id, ...userDoc.data() };
                setUser(userData); // Set the user context
                alert('Login Successfully');
                navigate('/student/dash');
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
                        <img src={logo} />
                    </div>
                    <form>
                        <h2>Login</h2>
                        <div className="inputbox">
                            <IonIcon icon={mailOutline} />
                            <input type="email" onChange={(e) => setStdEmail(e.target.value)} />
                            <label>Email</label>
                        </div>
                        <div className="inputbox">
                            <IonIcon icon={lockClosedOutline} />
                            <input type="password" onChange={(e) => setStdPassword(e.target.value)} />
                            <label>Password</label>
                        </div>
                        <button className="btn" onClick={login}>Login</button>
                        <div className="register">
                            <p>Are you a new Student? <Link to='/student/register'>Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default StudentLogin;
