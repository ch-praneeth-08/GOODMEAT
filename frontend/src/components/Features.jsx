import React from 'react';
import './Features.css';
import AnimateOnScroll from './AnimateOnScroll';

const featuresData = [
  {
    title: "Fresh on order",
    description: "We cut the meat only after you place your order. This means you receive the freshest possible product, never pre-packed or frozen.",
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752074020/feature-chicken_fcyq0t.jpg",
  },
  {
    title: "100% chemical-free",
    description: "Our meat is free from preservatives, additives, and any harmful chemicals. Just pure, natural taste and safety for your family.",
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752074020/feature-mutton_ee1cat.jpg",
    isReversed: true,
  },
  {
    title: "Ultra hygienic",
    description: "Every order is handled by trained staff wearing gloves and using sanitized equipment on clean counters. We take hygiene very seriously.",
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752074020/feature-fish_prmmrg.jpg",
  },
];

function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        {/* --- CHANGE animationType HERE --- */}
        <AnimateOnScroll animationType="fadeDown">
          <h2 className="section-title">Why GoodMeat is Better</h2>
        </AnimateOnScroll>
        
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <AnimateOnScroll
              key={index}
              animationType={feature.isReversed ? 'slideInRight' : 'slideInLeft'}
            >
              <article className={`feature-item ${feature.isReversed ? 'reversed' : ''}`}>
                <div className="feature-item__image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div className="feature-item__content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;