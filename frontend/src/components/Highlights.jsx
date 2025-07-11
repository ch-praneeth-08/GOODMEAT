import React from 'react';
import './Highlights.css';
import AnimateOnScroll from './AnimateOnScroll';

const highlightsData = [
  {
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752176815/localsource_wngttn.jpg",
    title: "Locally sourced",
    description: "We don't use cold storage — fresh and local everyday."
  },
  {
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752176760/delivery_hat8gr.jpg",
    title: "Daily delivery",
    description: "Across Hyderabad, every morning."
  },
  {
    image: "https://res.cloudinary.com/dilysokz6/image/upload/v1752176378/family_ijdm1x.jpg",
    title: "Trusted by families",
    description: "Consistent quality and service you can rely on."
  }
];

function Highlights() {
  return (
    <section className="highlights">
      <div className="container">
        <div className="highlights-grid">
          {highlightsData.map((item, index) => (
            <AnimateOnScroll key={index} className="highlight-card" delay={(index + 1) * 0.1}>
              {/* --- FIX: The wrapper div has been removed. The image is now a direct child. --- */}
              <img src={item.image} alt={item.title} className="highlight-card__image" />
              
              <h3 className="highlight-card__title">{item.title}</h3>
              <p className="highlight-card__description">{item.description}</p>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="highlights-summary" animationType="fadeUp">
          <div className="highlights-summary__image-placeholder">
            <img src="https://res.cloudinary.com/dilysokz6/image/upload/v1752074049/summary-image_asglus.png" alt="A platter with fresh chicken, mutton, and fish" />
          </div>
          <div className="highlights-summary__text">
            <h3>Fresh Chicken, Mutton & Fish</h3>
            <p>
              GoodMeat offers fresh cuts of Chicken, Mutton, and Fish, each prepared only after you order. Quality, hygiene, and daily deliveries set us apart. Every cut is 100% preservative-free, handled with care by our trained staff. Order via WhatsApp for the ultimate in convenience and freshness.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default Highlights;