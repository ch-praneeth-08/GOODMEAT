import React from 'react';
import './CallToAction.css';
import AnimateOnScroll from './AnimateOnScroll'; // Import our new component
import { FaWhatsapp } from 'react-icons/fa';

function CallToAction() {
  const WHATSAPP_URL = "https://wa.me/917981692303?text=I'd%20like%20to%20place%20an%20order";

  return (
    <section className="cta">
      {/* Wrap the entire container in the AnimateOnScroll component */}
      <AnimateOnScroll className="container cta__container">
        <h2>Order Now on WhatsApp</h2>
        <p>Fresh meat, hygienic cuts, instant order.</p>
        <a 
          href={WHATSAPP_URL} 
          className="btn btn--whatsapp"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
          <span>Order via WhatsApp</span>
        </a>
      </AnimateOnScroll>
    </section>
  );
}

export default CallToAction;