import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentRegister from "./Student/StudentRegister";
import StudentLogin from "./Student/StudentLogin";
import FacultyLogin from "./Faculty/FacultyLogin";
import FacultyRegister from "./Faculty/FacultyRegister";
import FacultyDash from "./Faculty/FacultyDash";
import AdminLogin from "./Admin/AdminLogin";
import AdminDash from "./Admin/AdminDash";
import ViewStudent from "./Admin/Student/ViewStudent";
import ViewFaculty from "./Admin/ViewFaculty";
import Login from "./Login";
import ProgramsList from "./Admin/Student/ProgramList";
import Course from "./Admin/Course/Course";
import SemPerf from "./Student/semPerf";
import StudentRegistration from "./Admin/CourseRegistration/StudentRegistration";
import StudentDash from "./Student/StudentDash"
import Home from "./LandingPages/Home";
import RegistrationSummary from "./Admin/CourseRegistration/RegistrationSummary";
import AcademicPerformance from "./Student/AcademicPerformance";
import AdminPanel from "./Admin/CourseRegistration/AdminPanel";
import UploadSyllabus from "./Admin/Program/UploadSyllabus";
import ViewSyllabus from "./Admin/ViewSyllabus";
import ProgramManagement from "./Admin/Program/ProgramManagement";


const Rout = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home/>} />
                <Route path='/admin/login' element={<AdminLogin />} />
                <Route path="/admin/dash" element={<AdminDash/>}/>
                <Route path="/admin/viewStudent" element ={<ViewStudent/>}/>
                <Route path="/admin/viewFaculty" element ={<ViewFaculty/>}/>
                <Route path="/admin/viewStudentPW" element ={<ProgramsList/>}/>
                <Route path="/admin/course/regdetails" element ={<AdminPanel/>}/>
                <Route path="/admin/semPerf" element = {<SemPerf/>}/>
                <Route path="/admin/dash/syllabus" element = {<UploadSyllabus/>}/>
                <Route path="/admin/course" element = {<Course/>}/>
                <Route path='/faculty/login' element={<FacultyLogin />} />
                <Route path='/faculty/register' element={<FacultyRegister />} />
                <Route path="/faculty/dash" element={<FacultyDash/>}/>
                <Route path='/student/login' element={<StudentLogin />} />
                <Route path="/student/dash" element={<StudentDash/>}/>
                <Route path="/student/dash/perform" element={<AcademicPerformance/>}/>
                <Route path='/student/register' element={<StudentRegister />} />
                <Route path='/student/cregister' element={<StudentRegistration />} />
                <Route path='/student/cregister/print' element={<RegistrationSummary />} />
                <Route path='/dash/syllabus' element={<ViewSyllabus/>} />
                <Route path='/admin/Program' element={<ProgramManagement/>} />
            </Routes>
        </>
    )
}

export default Rout;