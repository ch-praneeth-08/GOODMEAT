import React from 'react';
import './ProductCard.css';
import { FaWhatsapp } from 'react-icons/fa';

function ProductCard({ product }) {
  const onSale = product.discountPrice && product.discountPrice > 0;
  
  let discountPercent = 0;
  if (onSale) {
    discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }

  const finalPrice = onSale ? product.discountPrice : product.price;
  const orderMessage = `Hello! I would like to order the following item:\n\n*Product:* ${product.name}\n*Price:* ₹${finalPrice}`;
  const WHATSAPP_ORDER_URL = `https://wa.me/917981692303?text=${encodeURIComponent(orderMessage)}`;

  return (
    <article className={`product-card ${!product.inStock ? 'is-out-of-stock' : ''}`}>
      {/* --- FIX: Display the category name, not the object/ID --- */}
      <div className="product-card__category-tag">{product.category?.name || 'Uncategorized'}</div>
      
      {onSale && (
        <div className="product-card__discount-tag">
          {discountPercent}% OFF
        </div>
      )}

      <div className="product-card__image-wrapper">
        <img src={product.image} alt={product.name} className="product-card__image" />
        {!product.inStock && (
          <div className="out-of-stock-overlay"><span>Out of Stock</span></div>
        )}
      </div>
      
      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <div className="product-card__price-wrapper">
            {onSale ? (
              <>
                <p className="product-card__price--sale">₹{product.discountPrice}</p>
                <p className="product-card__price--original"><del>₹{product.price}</del></p>
              </>
            ) : (
              <p className="product-card__price">₹{product.price}</p>
            )}
            <span className="product-card__unit">{product.unit}</span>
          </div>
          <a 
            href={WHATSAPP_ORDER_URL} 
            className={`btn-order ${!product.inStock ? 'disabled' : ''}`} 
            onClick={(e) => !product.inStock && e.preventDefault()}
          >
            <FaWhatsapp />
            <span>{product.inStock ? 'Order' : 'Unavailable'}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;