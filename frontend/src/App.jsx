import { Routes, Route, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Otp from './pages/Otp';
import AboutUs from './pages/AboutUs';
import Profile from './pages/Profile';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from "./components/Footer";
import MyListings from "./pages/MyListings";
import AddProductPage from "./pages/AddProductPage";
import PreviousPurchasePage from './pages/PreviousPurchasePage';
import Cart from "./pages/Cart";

import './App.css';

function App() {
  const location = useLocation();

  // hide Navbar/Sidebar on login & register
  const hideNav = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNav && <Navbar />}
      {!hideNav && <Sidebar />}

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user/otp' element={<Otp />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/addproduct' element={<AddProductPage/>} />
        <Route path='/listing' element={<MyListings />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/previous-purchase' element={<PreviousPurchasePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
