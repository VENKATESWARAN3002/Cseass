import { Button } from '@mui/material';
import { styled } from '@mui/system';
const CustomButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    fontSize: '1rem', 
    fontWeight:'bold',
    letterSpacing: '.1em',
    color: '#A8422D',
    textDecoration: 'none',
    textTransform: 'uppercase',
    background: 'white',
    border: '2px solid #A8422D',
    borderRadius: 30, // Reduce border radius
    padding: '5px 15px', // Reduce padding
    paddingTop: 2,
    margin: '0px 320px', // Reduce margin
    overflow: 'hidden',
    width: '200px', // Adjust width as needed
    height: '50px',
    zIndex: 1,
    transition: '1s',
    '&:hover': {
      border: '2px solid #A8422D',
      color: 'hsla(0, 0%, 96%, 0.952)',
      '&::before': {
        width: '100%',
      },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-50px',
      width: 0,
      height: '100%',
      background: '#A8422D',
      transform: 'skewX(65deg)',
      zIndex: -1,
      transition: '1s',
    },
  }));

  export default CustomButton