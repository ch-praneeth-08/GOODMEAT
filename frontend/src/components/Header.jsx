import React, { useState, useEffect } from 'react';
// --- 1. IMPORT hooks and links from BOTH libraries ---
import { NavLink, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.svg';
import { FaWhatsapp } from 'react-icons/fa';

function Header() {
  const professionalMessage = "Hello! I'd like to place an order with GoodMeat.";
  const WHATSAPP_URL = `https://wa.me/917981692303?text=${encodeURIComponent(professionalMessage)}`;
  
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // --- 2. GET THE CURRENT LOCATION ---
  const location = useLocation();
  // Check if the current path is the homepage
  const isHomePage = location.pathname === '/';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/edit');
  if (isAdminPage) {
    return null;
  }

  const handleLogout = () => {
    axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        navigate('/');
      }).catch(err => {
        console.error('Logout failed:', err);
        setIsLoggedIn(false);
        navigate('/');
      });
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__left">
          <RouterLink to="/" className="header__logo"><img src={logo} alt="GoodMeat Logo" /></RouterLink>
          <nav className="header__nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Home</NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Products</NavLink>
            
            {/* --- 3. THE CONDITIONAL LINK LOGIC --- */}
            {isHomePage ? (
              // If we are on the homepage, use ScrollLink for a smooth scroll
              <ScrollLink 
                to="contact" 
                spy={true} 
                smooth={true} 
                offset={-100} 
                duration={500} 
                className="header__nav-link" 
                activeClass="active"
              >
                Contact
              </ScrollLink>
            ) : (
              // If we are on another page, use RouterLink to go to the homepage's contact section
              <RouterLink to="/#contact" className="header__nav-link">
                Contact
              </RouterLink>
            )}

            {isLoggedIn && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Admin Panel</NavLink>
            )}
          </nav>
        </div>
        <div className="header__right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn--secondary">Logout</button>
          ) : (
            <a href={WHATSAPP_URL} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
              <span>Order on WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;