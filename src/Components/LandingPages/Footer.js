import React from 'react';
import { Container, Grid, Typography, Link, Box, IconButton, styled } from '@mui/material';
import { LocationOn, Email, Phone, Fax } from '@mui/icons-material';
import { ReactTyped as Typed } from 'react-typed'; // Adjusted the import statement
import './Footer.css'; // Ensure this is included to apply the styles
import InstagramIcon from './instagram-icon.svg.svg';
import FacebookIcon from './facebook-icon.svg.svg';
import YouTubeIcon from './youtube-icon.svg';
import XIcon from './x-icon.svg.png';
import LinkedInIcon from './linkedin-icon.svg.svg';

import { School, Business, Assessment, Verified, Star } from '@mui/icons-material';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontFamily: 'Poppins',
  color: theme.palette.primary.main,
}));

const Footer = () => {
  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
   
  };

  return (
    <>
      <footer className="footer-area section-gap">
        <Container>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" justifyContent="flex-start" mb={3} ml={-8}>
                <Link href="https://ptuniv.edu.in/" target="_blank" underline="none">
                  <img
                    className="img-responsive logo"
                    alt="PTU"
                    src="./ptu-logo.png"
                    width="180px"
                    height="220px"
                  />
                </Link>
              </Box>
              <Typography variant="subtitle1" className="text-white ml-2" ml={-18}>
                <Typed
                  strings={["PTU - CSE ACADEMIC AUTOMATION SYSTEM"]}
                  typeSpeed={80}
                  backSpeed={50}
                  loop
                />
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={2}>
                <Typography variant="h6" className="footer-heading">QUICK LINKS</Typography>
                <ul className="footer-list">
                  <li>
                    <School style={{ marginRight: '8px' }} />
                    <Link href="https://ptuniv.edu.in/" target="_blank" rel="noopener noreferrer" underline="none">
                      PTU
                    </Link>
                  </li>
                  <li>
                    <Business style={{ marginRight: '8px' }} />
                    <Link href="https://hrm.mhrd.gov.in/home" target="_blank" rel="noopener noreferrer" underline="none">
                      MHRD
                    </Link>
                  </li>
                  <li>
                    <Assessment style={{ marginRight: '8px' }} />
                    <Link href="https://www.nirfindia.org/Home" target="_blank" rel="noopener noreferrer" underline="none">
                      NIRF
                    </Link>
                  </li>
                  <li>
                    <Verified style={{ marginRight: '8px' }} />
                    <Link href="http://www.naac.gov.in/" target="_blank" rel="noopener noreferrer" underline="none">
                      NAAC
                    </Link>
                  </li>
                  <li>
                    <Star style={{ marginRight: '8px' }} />
                    <Link href="https://www.nbaind.org/" target="_blank" rel="noopener noreferrer" underline="none">
                      NBA
                    </Link>
                  </li>
                </ul>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={6}>
                <Typography variant="h6" className="footer-heading">CONTACT US</Typography>
                <ul className="contact_box">
                  <li className="contact-item">
                    <LocationOn className="contact-icon text-blue-500" />
                    <Typography variant="body2" className="contact-text">
                      <strong>PTU CSE ACADEMIC AUTOMATION SYSTEM,</strong>
                      <br />
                      Puducherry Technological University,
                      <br />
                      East coast Road, Pillaichavady, Puducherry, 605 014.
                    </Typography>
                  </li>
                  <li className="contact-item">
                    <Email className="contact-icon text-red-500" />
                    <Typography variant="body2" className="contact-text">
                      <strong>Email:</strong> <Link href="mailto:dean.info@ptuniv.edu.in" underline="none" className="text-red-500">info@ptuniv.edu.in</Link>
                    </Typography>
                  </li>
                  <li className="contact-item">
                    <Phone className="contact-icon text-green-500" />
                    <Typography variant="body2" className="contact-text">
                      <strong>Phone:</strong> 0413-2655281-288
                    </Typography>
                  </li>
                  <li className="contact-item">
                    <Fax className="contact-icon text-yellow-500" />
                    <Typography variant="body2" className="contact-text">
                      <strong>Fax:</strong> 2655101
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box display="flex" flexDirection="column" mt={2}>
                <Typography variant="h6" className="footer-heading">CONNECT WITH US</Typography>
                <Box display="flex" mt={1}>
                  <IconButton className="social-icon" onClick={() => window.open("https://www.facebook.com/PTU.Pondicherry/", "_blank")}>
                    <img src={FacebookIcon} alt="Facebook" />
                  </IconButton>
                  <IconButton className="social-icon" onClick={() => window.open("https://www.youtube.com/channel/UCf05rByI6M6mN7nEXdO4dHw/channels", "_blank")}>
                    <img src={YouTubeIcon} alt="YouTube" />
                  </IconButton>
                  <IconButton className="social-icon" onClick={() => window.open("https://twitter.com/PUDUCHERRYTECH1", "_blank")}>
                    <img src={XIcon} alt="X" />
                  </IconButton>
                  <IconButton className="social-icon" onClick={() => window.open("https://www.instagram.com/puducherry_tech_university/", "_blank")}>
                    <img src={InstagramIcon} alt="Instagram" />
                  </IconButton>
                  <IconButton className="social-icon" onClick={() => window.open("https://in.linkedin.com/school/ptu-puducherry/", "_blank")}>
                    <img src={LinkedInIcon} alt="LinkedIn" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </>
  );
};

export default Footer;


