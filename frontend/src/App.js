
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import News from './Components/News';
import Login from './Components/Login';
import Bookmarks from './Components/Bookmarks';
import Register from './Components/Register';
import './App.css';
import Footer from './Components/Footer';

function AppLayout() {
  const location = useLocation();

  
  const hideFooterRoutes = ["/login", "/register", "/bookmarks"];

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/general" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/:category" element={<News />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;


