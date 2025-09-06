import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Otp from './pages/Otp';
import { Routes, Route } from "react-router-dom"
import AboutUs from './pages/AboutUs';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/user/otp' element={<Otp />} />
        <Route path='/about' element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;
