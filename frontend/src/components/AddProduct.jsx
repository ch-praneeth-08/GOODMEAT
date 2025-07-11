import React, { useState } from 'react';
import axios from 'axios';
import { MdCheck } from 'react-icons/md'; // Import the check icon
import ImageUpload from './ImageUpload';
import CustomSelectMenu from './CustomSelectMenu';
import './AddProduct.css';

function AddProduct({ categories, onProductAdded }) {
  const [productData, setProductData] = useState({
    name: '', category: '', subCategories: [], price: '', unit: 'per 500g', image: '', description: '', inStock: true, discountPrice: ''
  });
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (imageUrl) => { 
    setProductData(prevState => ({ ...prevState, image: imageUrl })); 
  };

  const handleCategoryChange = (selectedCategory) => {
    setProductData(prevState => ({ ...prevState, category: selectedCategory._id, subCategories: [] }));
    setAvailableSubCategories(selectedCategory.subCategories || []);
  };

  const handleSubCategoriesChange = (subCategoryId) => {
    setProductData(prevData => {
      const currentSubCats = prevData.subCategories;
      if (currentSubCats.includes(subCategoryId)) {
        return { ...prevData, subCategories: currentSubCats.filter(id => id !== subCategoryId) };
      } else {
        return { ...prevData, subCategories: [...currentSubCats, subCategoryId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productData.category || productData.subCategories.length === 0) {
      setMessage("Please select a category and at least one sub-category.");
      return;
    }
    if (!productData.image) {
      setMessage("Please upload an image.");
      return;
    }
    
    setMessage('Adding product...');
    axios.post('http://localhost:5000/products/add', productData, { withCredentials: true })
      .then(() => {
        setMessage('Product added successfully!');
        setProductData({ name: '', category: '', subCategories: [], price: '', unit: 'per 500g', image: '', description: '', inStock: true, discountPrice: '' });
        setAvailableSubCategories([]);
        onProductAdded();
      }).catch(err => {
        console.error(err);
        setMessage('Error adding product.');
      });
  };

  return (
    <div className="admin-pane-container">
      {message && <div className="admin-message-toast" onAnimationEnd={() => setMessage('')}>{message}</div>}
      <div className="admin-pane-header">
        <h2 className="admin-pane-title">Create a New Product</h2>
      </div>
      <p className="admin-pane-description">Fill out the details below to add a new item to your store inventory.</p>
      <form className="add-product-form-layout" onSubmit={handleSubmit}>
        <div className="form-column">
          <h3 className="form-section-title">Core Details</h3>
          <div className="form-group"><label>Product Name</label><input type="text" name="name" required value={productData.name} onChange={handleChange} placeholder="e.g., Chicken Drumsticks" /></div>
          <div className="form-group">
            <CustomSelectMenu label="Category" options={categories} selected={productData.category} onChange={handleCategoryChange} placeholder="Select Category"/>
          </div>
          <div className="form-group">
            <label>Sub-Categories (Select all that apply)</label>
            <div className="sub-category-checkbox-group">
              {productData.category ? (
                availableSubCategories.length > 0 ? (
                  availableSubCategories.map(sub => (
                    // --- FIX: New JSX structure for custom checkbox ---
                    <label key={sub._id} className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={productData.subCategories.includes(sub._id)}
                        onChange={() => handleSubCategoriesChange(sub._id)}
                      />
                      <span className="custom-checkbox"><MdCheck /></span>
                      {sub.name}
                    </label>
                  ))
                ) : ( <p>No sub-categories found.</p> )
              ) : ( <p>Please select a parent category first.</p> )}
            </div>
          </div>
          <div className="form-group-inline">
            <div className="form-group"><label>Price (in ₹)</label><input type="number" name="price" required value={productData.price} onChange={handleChange} placeholder="e.g., 250" /></div>
            <div className="form-group"><label>Discount Price</label><input type="number" name="discountPrice" placeholder="Optional" value={productData.discountPrice} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Unit</label><input type="text" name="unit" required value={productData.unit} onChange={handleChange} placeholder="e.g., per 500g" /></div>
        </div>
        <div className="form-column">
          <h3 className="form-section-title">Media & Description</h3>
          <ImageUpload onUpload={handleImageUpload} value={productData.image} />
          <div className="form-group"><label>Description</label><textarea name="description" rows="5" required value={productData.description} onChange={handleChange} placeholder="Describe the product..."></textarea></div>
          <div className="form-group-checkbox"><label><input type="checkbox" name="inStock" checked={productData.inStock} onChange={handleChange} /> Product is in stock</label></div>
        </div>
        <div className="form-submit-area">
          <button type="submit" className="btn btn--primary btn--large">Add Product to Store</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;