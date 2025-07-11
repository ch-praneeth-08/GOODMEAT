import React from 'react';
import './ProductCardSkeleton.css';

function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text-short"></div>
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;