import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.svg';

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // --- NEW: Check if we are on an admin-related page ---
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/edit');
  if (isAdminPage) {
    return null; // Render nothing if on an admin page
  }
  
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__branding">
          <Link to="/">
            <img src={logo} alt="GoodMeat Logo" className="footer__logo" />
          </Link>
          <p className="footer__copyright">
            © {currentYear} GoodMeat. All Rights Reserved.
          </p>
        </div>
        <div className="footer__links">
          <div className="footer__links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/#features">Features</Link></li>
              <li><Link to="/#about">About</Link></li>
              <li><Link to="/products">Products</Link></li>
            </ul>
          </div>
          <div className="footer__links-col">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="https://wa.me/917981692303" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Location</a></li>
            </ul>
          </div>
          <div className="footer__links-col">
            <h4>GoodMeat</h4>
            <p>Hyderabad</p>
            <p>Open 8:30 AM – 9:30 PM</p>
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>
              <Link to="/login" className="footer-admin-link">Admin Login</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;