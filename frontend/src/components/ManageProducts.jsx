import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ManageProducts({ products, loading, triggerRefresh, categories, activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  const [message, setMessage] = useState('');

  const handleDelete = (productId) => { 
    if (window.confirm('Are you sure?')) { 
      axios.delete(`http://localhost:5000/products/${productId}`, { withCredentials: true })
        .then(() => { 
          setMessage('Product deleted!'); 
          triggerRefresh(); 
        })
        .catch(err => { 
          console.error(err); 
          setMessage('Error deleting product.'); 
        }); 
    } 
  };
  
  if (loading && products.length === 0) {
    return <p>Loading products...</p>
  }

  return (
    <div className="admin-pane-container">
      {message && <div className="admin-message-toast" onAnimationEnd={() => setMessage('')}>{message}</div>}
      <div className="admin-pane-header">
        <h2 className="admin-pane-title">All Products</h2>
        <span className="item-count-badge">{products.length} Products Found</span>
      </div>
      <p className="admin-pane-description">Search, filter, edit, or delete existing products in your store.</p>
      <div className="admin-controls-bar">
        <div className="admin-search-container"><input type="text" placeholder="Search products..." className="admin-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="admin-filter-container"><select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="admin-filter-select"><option value="All">All Categories</option>{categories.map(cat => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}</select></div>
      </div>
      <table className="products-table responsive-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            {/* --- FIX: Added a new column for Sub-Categories --- */}
            <th>Sub-Categories</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className={!product.inStock ? 'out-of-stock-row' : ''}>
              <td data-label="Product">
                <div className="product-info-cell">
                  <img src={product.image} alt={product.name} className="table-img" />
                  <span>{product.name}</span>
                </div>
              </td>
              <td data-label="Category">{product.category?.name || 'N/A'}</td>
              {/* --- FIX: Display the names of the sub-categories --- */}
              <td data-label="Sub-Categories">
                {product.subCategories?.map(sc => sc.name).join(', ') || 'N/A'}
              </td>
              <td data-label="Status">
                <div className={`status-indicator ${product.inStock ? 'status-in-stock' : 'status-out-of-stock'}`}>
                  <div className="status-dot"></div>
                  <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </td>
              <td data-label="Price">
                <div className="price-cell">
                  {product.discountPrice ? (
                    <>
                      <span className="price-sale">₹{product.discountPrice}</span>
                      <span className="price-original"><del>₹{product.price}</del></span>
                    </>
                  ) : (
                    <span className="price-regular">₹{product.price}</span>
                  )}
                </div>
              </td>
              <td data-label="Actions">
                <div className="actions-cell">
                  <Link to={`/edit/${product._id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProducts;