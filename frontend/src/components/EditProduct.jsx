import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdCheck } from 'react-icons/md'; // Import the check icon
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import CustomSelectMenu from './CustomSelectMenu';
import AdminLayout from './AdminLayout';
import './EditProduct.css';

function EditProduct() {
  const [productData, setProductData] = useState({
    name: '', category: '', subCategories: [], price: '', unit: '', image: '', description: '', inStock: true, discountPrice: ''
  });
  const [categories, setCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = axios.get('http://localhost:5000/categories/', { withCredentials: true });
    const fetchProductData = axios.get(`http://localhost:5000/products/${id}`, { withCredentials: true });
    Promise.all([fetchCategories, fetchProductData])
      .then(([categoriesRes, productRes]) => {
        const allCategories = categoriesRes.data;
        const product = productRes.data;
        setCategories(allCategories);
        if (product) {
          setProductData({
            ...product,
            category: product.category?._id || '',
            subCategories: product.subCategories?.map(sc => sc._id) || [],
          });
          const parentCategory = allCategories.find(c => c._id === product.category?._id);
          if (parentCategory) {
            setAvailableSubCategories(parentCategory.subCategories || []);
          }
        }
      }).catch(error => {
        console.error("Error fetching data!", error);
        setMessage("Could not load data.");
      });
  }, [id]);

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
    setMessage('Updating product...');
    axios.post(`http://localhost:5000/products/update/${id}`, productData, { withCredentials: true })
      .then(() => {
        setMessage('Product updated successfully!');
        setTimeout(() => navigate('/admin'), 1500);
      }).catch(err => {
        console.error(err);
        setMessage('Error updating product.');
      });
  };
  
  return (
    <AdminLayout>
      <div className="admin-pane-container">
        {message && <div className="admin-message-toast" onAnimationEnd={() => setMessage('')}>{message}</div>}
        <div className="admin-pane-header"><h2 className="admin-pane-title">Edit Product</h2></div>
        <p className="admin-pane-description">Update the details for "{productData.name || '...'}" below.</p>
        <form className="edit-product-form-layout" onSubmit={handleSubmit}>
          <div className="form-column">
            <h3 className="form-section-title">Core Details</h3>
            <div className="form-group"><label>Product Name</label><input type="text" name="name" required value={productData.name || ''} onChange={handleChange} /></div>
            <div className="form-group">
                <CustomSelectMenu label="Category" options={categories} selected={productData.category} onChange={handleCategoryChange} placeholder="Select Category" />
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
              <div className="form-group"><label>Price (in ₹)</label><input type="number" name="price" required value={productData.price || ''} onChange={handleChange} /></div>
              <div className="form-group"><label>Discount Price</label><input type="number" name="discountPrice" placeholder="Optional" value={productData.discountPrice || ''} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label>Unit</label><input type="text" name="unit" required value={productData.unit || ''} onChange={handleChange} /></div>
          </div>
          <div className="form-column">
            <h3 className="form-section-title">Media & Description</h3>
            <ImageUpload onUpload={handleImageUpload} value={productData.image} />
            <div className="form-group"><label>Description</label><textarea name="description" rows="5" required value={productData.description || ''} onChange={handleChange}></textarea></div>
            <div className="form-group-checkbox"><label><input type="checkbox" id="inStockEdit" name="inStock" checked={productData.inStock} onChange={handleChange} /> Product is in stock</label></div>
          </div>
          <div className="form-submit-area"><button type="submit" className="btn btn--primary btn--large">Save Changes</button></div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;