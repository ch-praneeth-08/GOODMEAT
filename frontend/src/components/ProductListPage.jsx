import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ShopByCategory from './ShopByCategory';
import './ProductListPage.css';

function ProductListPage() {
  const { categoryName } = useParams();
  const location = useLocation();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeSubCategory, setActiveSubCategory] = useState('All');

  const fetchData = useCallback((catId, subCatId) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('category', catId);

    if (subCatId !== 'All') {
      params.append('subCategory', subCatId);
    }

    axios.get(`http://localhost:5000/products/?${params.toString()}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Could not fetch products.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (categoryName) {
      setLoading(true);
      setError('');
      // --- FIX: We no longer set the category to null here. ---
      // This prevents the page header and sub-category scroller from disappearing.
      // setCategory(null); // <-- THIS LINE HAS BEEN REMOVED
      setActiveSubCategory('All');

      axios.get(`http://localhost:5000/categories/by-name/${categoryName}`)
        .then(response => {
          const fetchedCategory = response.data;
          setCategory(fetchedCategory);
          fetchData(fetchedCategory._id, 'All');
        })
        .catch(err => {
          console.error('Error fetching category data:', err);
          setError(`Category '${categoryName}' not found.`);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [categoryName, fetchData]);

  useEffect(() => {
    // This effect handles subsequent filtering by sub-category
    if (category) {
      fetchData(category._id, activeSubCategory);
    }
  }, [activeSubCategory, category, fetchData]);
  
  // Case 1: Base /products route
  if (!categoryName && location.pathname === '/products') {
    return <div className="all-products-view"><ShopByCategory /></div>;
  }

  // Case 2: Show skeleton loader for the very first page load
  if (!category && loading) {
    return (
       <div className="product-list-page">
           <div className="container product-grid-container" style={{paddingTop: '4rem'}}>
               <div className="products-grid">
                   {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
               </div>
           </div>
       </div>
    );
  }

  // Case 3: Show error message if something went wrong
  if (error) {
    return <div className="full-grid-message"><h3>Error</h3><p>{error}</p></div>;
  }
  
  return (
    <div className="product-list-page">
      <div className="category-header">
        <h1 className="category-header-title">{category?.name}</h1>
        {category?.description && <p className="category-header-description">{category.description}</p>}
      </div>

      {category?.subCategories && (
        <div className="sub-category-scroller-wrapper">
            <div className="container sub-category-scroller">
                <div 
                    className={`sub-category-item ${activeSubCategory === 'All' ? 'active' : ''}`} 
                    onClick={() => setActiveSubCategory('All')}
                >
                    <img src={category?.image} alt="All" className="sub-category-image" />
                    <div className="sub-category-name">All</div>
                </div>
                {category.subCategories.map(sub => (
                    <div 
                        key={sub._id} 
                        className={`sub-category-item ${activeSubCategory === sub._id ? 'active' : ''}`} 
                        onClick={() => setActiveSubCategory(sub._id)}
                    >
                        <img src={sub.image} alt={sub.name} className="sub-category-image" />
                        <div className="sub-category-name">{sub.name}</div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="container product-grid-container">
        <div className="products-grid">
          {loading ? (
            Array.from({ length: products.length || 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
          ) : products.length > 0 ? (
            products.map(product => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="full-grid-message">
              <h3>No Products Found</h3>
              <p>There are currently no products available in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;