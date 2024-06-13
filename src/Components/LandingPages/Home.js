import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "../../css/assests/landingpage.css"
import Footer from './Footer';
const Home = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) { // Adjust threshold as needed
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div>
  <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GreatStack</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="stylesheet" href="../.." />
  <link rel="preconnect" href="https://fonts.googleapis.com/" />
  <link rel="preconnect" href="https://fonts.googleapis.com/" />
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
    crossOrigin="anonymous"
    referrerPolicy="no-referrer"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,800;1,100;1,300&display=swap"
    rel="stylesheet"
  />
  <div id="root">
  <div className="last" >
    <p> CSE ACADEMIC AUTOMATION SYSTEM</p>
  </div>
    <div>
      <div className="ptu-title__container">
        <div className="ptu-title__logo-header">
          <a rel="noopener noreferrer" href="/">
            <img
              src="./ptu-logo.png"
              className="ptu-title__logo"
              alt="Puducherry Technological University"
            />
          </a>
          <div className="ptu-title__collage-name-container">
            <h1 className="ptu-title__collage-name">
              <span className="ptu-title__first-letter">P</span>
              <span>UDUCHERRY</span>
              <span className="ptu-title__first-letter">T</span>
              <span>ECHNOLOGICAL</span>
              <span className="ptu-title__first-letter">U</span>
              <span>NIVERSITY</span>
            </h1>
            <h6 className="ptu-title__place">Puducherry, India</h6>
          </div>
        </div>
      </div>
    </div>
    <nav className="desktop-nav" style={{ left: 0, height: 58 }}>
      <div className="desktop-nav__container">
        <div className="desktop-nav__link-section">
          <a className="desktop-nav__link desktop-nav__main-link " href="#">
            Home
          </a>
        </div>
        <div className="desktop-nav__link-section">
          <a
            className="desktop-nav__link desktop-nav__main-link "
            href="#about"
          >
            About us
          </a>
        </div>
        <div className="desktop-nav__link-section">
          <a
            href="#last"
            className="desktop-nav__link desktop-nav__main-link "
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
    <div className="hero container">
      <div className="hero-text">
        <h1>We Ensure better education for a better world</h1>
        <p>
          Our cutting-edge curriculum is designed to empower students with the
          knowledge, skills, and experiences needed to excel in the dynamic
          field of education
        </p>
        <Link to="/login" className="btn">
          Explore more <i className="fa fa-chevron-right" style={{marginLeft:"20px", color: "#A8422D" }} />
        </Link>
      </div>
    </div>
    <div className="container">
      <div className="about" id="about">
        <div className="about-right">
          <h3>ABOUT US</h3>
          <h2>Nurturing Tomorrow's Leaders Today</h2>
          <p>
            The Department of Computer Science and Engineering was established
            in the year 1987 with the objective of imparting high quality
            education in the field of Computer Science. It provides a
            comprehensive program that emphasizes on Advanced Data Structures
            and Algorithms, Advanced Software Design, Artificial Intelligence,
            Parallel and Distributed Systems, Graphics and Image Processing,
            Machine Learning, Internet of Things, Information Security, Digital
            Forensics, Big Data and Data Mining.
            <br />
            <br />
            The department has competent and committed faculty which encourages
            students' involvement in various academic and co-curricular
            activities. The department has well equipped computer laboratories
            with more than 400 computers and a Research Laboratory to carry out
            research and project activities. The department has the latest
            infrastructure facilities with high speed Internet, advanced
            software labs, hardware labs, seminar halls and class rooms equipped
            with LCD projectors. Students of all programmes can take project
            internship with different organizations.
            <br />
            <br />
            This component has been included in the curriculum to provide
            exposure for the students to work in an organization environment, as
            well as a chance to apply the learning in solving real-world
            business problems. The department has a long tradition of producing
            technically competent engineers since 1987 and it has renowned
            alumni occupying prominent positions in the industry, academia and
            research all over the world. The students of the department have got
            placements in major companies like HP, ZOHO, HCL, NOKIA, INFOSYS,
            RELIANCE, CTS, L&amp;T INFOTECH etc.The Department faculty are
            actively involved in various AICTE- RPS, UGC and SERB Sponsored
            Research Projects, Consultancy projects and Collaborative Projects
            with other government sectors.
          </p>
        </div>
      </div>
      <button
      onClick={scrollToTop}
      id="myBtn"
      title="Go to top"
      style={{ display: showButton ? 'block' : 'none', color: "aliceblue" ,backgroundColor:'red'}}
    >
      <i className="fa fa-chevron-up"></i>
    </button>
  
    </div>
  </div>
  <div className="last" id='last'>
    <Footer/>
    <p>© 2024 Puducherry Technological University. All rights reserved.</p>
    <p>Developed by PTU's Web Team.</p>
  </div>
  <div
    style={{
      backgroundColor: "rgb(255, 255, 255)",
      border: "1px solid rgb(215, 215, 215)",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
      borderRadius: 4,
      left: "auto",
      top: "-10000px",
      zIndex: -2147483648,
      position: "absolute",
      pointerEvents: "auto",
      transition: "opacity 0.15s ease-out 0s",
      opacity: 0,
      visibility: "hidden"
    }}
    aria-hidden="true"
  >
    <div style={{ position: "relative", zIndex: 1 }}>
      <iframe
        src="https://newassets.hcaptcha.com/captcha/v1/f407fb0/static/hcaptcha.html#frame=challenge&id=03iltd9oymvi&host=greatstack.in&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=en&tplinks=on&pstissuer=https%3A%2F%2Fpst-issuer.hcaptcha.com&sitekey=50b2fe65-b00b-4b9e-ad62-3ba471098be2&theme=light&origin=https%3A%2F%2Fgreatstack.in"
        frameBorder={0}
        scrolling="no"
        allow="private-state-token-issuance 'src'; private-state-token-redemption 'src'"
        title="Main content of the hCaptcha challenge"
        style={{ border: 0, zIndex: 2000000000, position: "relative" }}
      />
    </div>
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        pointerEvents: "none",
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: "rgb(255, 255, 255)",
        opacity: "0.05"
      }}
    />
    <div
      style={{
        borderWidth: 11,
        position: "absolute",
        pointerEvents: "none",
        marginTop: "-11px",
        zIndex: 1,
        right: "100%"
      }}
    >
      <div
        style={{
          borderWidth: 10,
          borderStyle: "solid",
          borderColor: "transparent rgb(255, 255, 255) transparent transparent",
          position: "relative",
          top: 10,
          zIndex: 1
        }}
      />
      <div
        style={{
          borderWidth: 11,
          borderStyle: "solid",
          borderColor: "transparent rgb(215, 215, 215) transparent transparent",
          position: "relative",
          top: "-11px",
          zIndex: 0
        }}
      />
    </div>
  </div>
</>
    </div>
  )
}

export default Home