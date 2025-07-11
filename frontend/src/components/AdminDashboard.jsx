import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';
import AddProduct from './AddProduct';
import { MdDashboard, MdAddBox, MdCategory, MdLogout, MdMenu, MdClose } from 'react-icons/md';
import { useDebounce } from '../hooks/useDebounce';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('manageProducts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminActiveCategory, setAdminActiveCategory] = useState('All');
  // --- FIX: Removed the extra, incorrect useDebounce call ---
  const debouncedAdminSearchTerm = useDebounce(adminSearchTerm, 300);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = () => {
    setProductLoading(true);
    const params = new URLSearchParams();

    if (adminActiveCategory !== 'All') {
      const categoryObject = categories.find(cat => cat.name === adminActiveCategory);
      if (categoryObject) {
        params.append('category', categoryObject._id);
      }
    }

    if (debouncedAdminSearchTerm) {
      params.append('search', debouncedAdminSearchTerm);
    }
    const apiUrl = `http://localhost:5000/products/?${params.toString()}`;
    axios.get(apiUrl, { withCredentials: true })
      .then(res => {
        setProducts(res.data);
        setProductLoading(false);
      }).catch(err => {
        console.error("Error fetching products!", err);
        setProductLoading(false);
      });
  };

  const fetchCategories = () => {
    axios.get('http://localhost:5000/categories/', { withCredentials: true })
      .then(res => {
        setCategories(res.data);
      }).catch(err => {
        console.error("Error fetching categories!", err);
      });
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  useEffect(() => {
    if (categories.length > 0 || adminActiveCategory === 'All') {
        fetchProducts();
    }
  }, [refreshTrigger, adminActiveCategory, debouncedAdminSearchTerm, categories]);


  const handleLogout = () => {
    axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        navigate('/login');
      }).catch(err => {
        console.error('Logout failed:', err);
        setIsLoggedIn(false);
        navigate('/login');
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'manageProducts':
        return <ManageProducts products={products} loading={productLoading} triggerRefresh={triggerRefresh} categories={categories} activeCategory={adminActiveCategory} setActiveCategory={setAdminActiveCategory} searchTerm={adminSearchTerm} setSearchTerm={setAdminSearchTerm} />;
      case 'manageCategories':
        return <ManageCategories />;
      case 'addProduct':
        return <AddProduct categories={categories} onProductAdded={triggerRefresh} />;
      default:
        return <ManageProducts products={products} loading={productLoading} triggerRefresh={triggerRefresh} categories={categories} activeCategory={adminActiveCategory} setActiveCategory={setAdminActiveCategory} searchTerm={adminSearchTerm} setSearchTerm={setAdminSearchTerm} />;
    }
  };

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-is-open' : ''}`}>
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">GOODMEAT</h1>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <MdClose />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-button ${activeTab === 'manageProducts' ? 'active' : ''}`} onClick={() => { setActiveTab('manageProducts'); setIsSidebarOpen(false); }}><MdDashboard /><span>Manage Products</span></button>
          <button className={`nav-button ${activeTab === 'addProduct' ? 'active' : ''}`} onClick={() => { setActiveTab('addProduct'); setIsSidebarOpen(false); }}><MdAddBox /><span>Add New Product</span></button>
          <button className={`nav-button ${activeTab === 'manageCategories' ? 'active' : ''}`} onClick={() => { setActiveTab('manageCategories'); setIsSidebarOpen(false); }}><MdCategory /><span>Manage Categories</span></button>
        </nav>
        <button className="nav-button logout-button" onClick={handleLogout}><MdLogout /><span>Logout</span></button>
      </aside>
      <main className="admin-main-content">
        <div className="admin-mobile-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
            <MdMenu />
          </button>
          <span className="mobile-header-title">{activeTab.replace('manage', 'Manage ')}</span>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;