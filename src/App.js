import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import Rout from './Components/route'; 
import { AuthProvider } from './contexts/AuthContext'
function App() {
  return (
    <div className="App">
      <AuthProvider>
       <BrowserRouter>
       <Rout/>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
export default App;
