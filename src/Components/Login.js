import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container, Tooltip, Button } from '@mui/material';
import stdImage from './Students.png';
import facImage from './Teacher.png.png';
import adminImage from './AdminImage.png';
import backgroundImage from './ptu_admin_img.jpg'; // Adjust the path as necessary
import Footer from './LandingPages/Footer';
import Header from './Admin/CourseRegistration/Header';
const Login = () => {
  const navigate = useNavigate();
  const [particlesVisible, setParticlesVisible] = useState(true);

  const handleLoginClick = (userType) => {
    navigate(`/${userType}/login`); // Redirect based on user type
  };

  const toggleParticles = () => {
    setParticlesVisible(!particlesVisible);
  };

  const cardData = [
    { image: stdImage, title: 'Student Login', userType: 'student', description: 'Access your student portal' },
    { image: facImage, title: 'Faculty Login', userType: 'faculty', description: 'Access your faculty portal' },
    { image: adminImage, title: 'Admin Login', userType: 'admin', description: 'Access the admin portal' },
  ];

  return (
    <>
    <Header/>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background:'linear-gradient(#c97c7cb3, #be6675b3), url(./ptu_admin_img.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'linear-gradient(#c97c7cb3, #be6675b3)',
        color: '#fff',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 ,textAlign:'center'}}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: '#953553',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.7)',
            animation: 'glow 1.5s ease-in-out infinite alternate',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '3rem',
          }}
        >
          LOGIN AS
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Tooltip title={card.description} arrow>
                <Card
                  sx={{
                    maxWidth: 345,
                    background: 'linear-gradient(#c97c7cb3, #be6675b3)',
                    backdropFilter: 'blur(5px)', // Reduced blur effect
                    borderRadius: '15px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s, border 0.3s',
                    border: '1px solid transparent',
                    perspective: '1000px',
                    '&:hover': {
                      transform: 'scale(1.1) rotateY(15deg) rotateZ(5deg)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                      border: '1px solid #fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                  onClick={() => handleLoginClick(card.userType)}
                >
                  <CardMedia component="img" height="140" image={card.image} alt={`${card.title} Image`} />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#fff',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
        
      </Container>
      {particlesVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <ParticleBackground />
        </Box>
      )}
    </Box>
    <div>
            <Footer/>
    </div>
    </>
  );
};

const ParticleBackground = () => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 150,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: ['#00c3ff', '#ffff1c', '#ff2e63'],
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#FF0000',
            },
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.3,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 3,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.8 ,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'bubble',
            },
            onclick: {
              enable: true,
              mode: 'push',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="particles-js" style={{ position: 'absolute', width: '100%', height: '100%' }} />;
};

export default Login;

// CSS for animations
const styles = `
  @keyframes glow {
    from {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.7);
    }
    to {
      text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 1);
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }

  #particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
