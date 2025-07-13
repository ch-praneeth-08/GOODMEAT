import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Import All Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import ShopByCategory from './components/ShopByCategory'; // <-- 1. IMPORT
import Highlights from './components/Highlights';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import CallToAction from './components/CallToAction';
import ProductListPage from './components/ProductListPage';
import LoginPage from './components/LoginPage';
import EditProduct from './components/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';

// Define the HomePage component right here.
const HomePage = () => (
  <>
    <Hero />
    <ShopByCategory /> {/* <-- 2. ADD TO HOMEPAGE */}
    <Features />
    <Highlights />
    <Testimonials />
    <ContactForm />
    <CallToAction />
  </>
);

function ScrollToTopOnHome() {
  const location = useLocation();
  React.useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
      // Remove hash if present
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      // Re-enable scrolling if disabled
      document.body.style.overflow = '';
    }
  }, [location]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTopOnHome />
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* UPDATED ROUTE for specific categories */}
              <Route path="/products/:categoryName" element={<ProductListPage />} /> 
              {/* Keep the general products route for showing all categories */}
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route 
                path="/admin" 
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/edit/:id" 
                element={<ProtectedRoute><EditProduct /></ProtectedRoute>} 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;