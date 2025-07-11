import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnimateOnScroll from './AnimateOnScroll';
import './ShopByCategory.css';

function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/categories/')
      .then(response => {
        const visibleCategories = response.data.filter(cat => cat.image);
        setCategories(visibleCategories);
      })
      .catch(error => {
        console.error('Error fetching categories for grid:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || categories.length === 0) {
    return null; 
  }

  return (
    <section className="shop-by-category">
      <div className="container">
        <AnimateOnScroll animationType="fadeUp">
          <h2 className="section-title">Shop by Categories</h2>
          <p className="section-subtitle">Freshest meats and much more!</p>
        </AnimateOnScroll>
        
        <AnimateOnScroll animationType="fadeUp" delay={0.2}>
            <div className="category-grid">
            {categories.map(category => (
                <Link 
                    key={category._id} 
                    to={`/products/${category.name}`} 
                    className="category-grid-item"
                >
                <div className="category-grid-item__image-wrapper">
                    <img src={category.image} alt={category.name} className="category-grid-item__image" />
                </div>
                <h3 className="category-grid-item__name">{category.name}</h3>
                </Link>
            ))}
            </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

// --- FIX: Corrected 'export export default' to 'export default' ---
export default ShopByCategory;