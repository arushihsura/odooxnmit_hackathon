import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom"

const Headers = () => {
  return (
    <>
      <Navbar bg="light" variant="light" className="py-3 shadow-sm">
        <Container>
          <NavLink to="/" className="navbar-brand text-decoration-none d-flex align-items-center">
            <span className="text-primary me-1">○</span>
            <span className="text-dark fw-bold">circle</span>
          </NavLink>
          
          <Nav className="mx-auto">
            <NavLink 
              to="/" 
              className="nav-link text-white bg-primary rounded-pill px-4 py-2 mx-2 text-decoration-none"
            >
              Home
            </NavLink>
            <NavLink 
              to="/categories" 
              className="nav-link text-dark px-4 py-2 mx-2 text-decoration-none hover-bg-light rounded-pill"
            >
              Categories
            </NavLink>
            <NavLink 
              to="/make-wish" 
              className="nav-link text-dark px-4 py-2 mx-2 text-decoration-none hover-bg-light rounded-pill"
            >
              Make a Wish
            </NavLink>
            <NavLink 
              to="/sell" 
              className="nav-link text-dark px-4 py-2 mx-2 text-decoration-none hover-bg-light rounded-pill"
            >
              Sell on Circle
            </NavLink>
            <NavLink 
              to="/about" 
              className="nav-link text-dark px-4 py-2 mx-2 text-decoration-none hover-bg-light rounded-pill"
            >
              About Us
            </NavLink>
            <NavLink 
              to="/help" 
              className="nav-link text-dark px-4 py-2 mx-2 text-decoration-none hover-bg-light rounded-pill"
            >
              Need Help?
            </NavLink>
          </Nav>
          
          <Nav className="ms-auto">
            <NavLink 
              to="/register" 
              className="nav-link text-dark px-3 py-2 text-decoration-none d-flex align-items-center"
            >
              <span className="me-2">👤</span>
              Sign In
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      
      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        
        .nav-link {
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          transform: translateY(-1px);
        }
        
        .navbar-brand:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  )
}

export default Headers