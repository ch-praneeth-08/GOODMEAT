import React from 'react';
import './Testimonials.css';
import AnimateOnScroll from './AnimateOnScroll';

const testimonialsData = [
    // ... data array remains the same
    { quote: "The chicken is so fresh, I can taste the difference. Safe for my family.", name: "Arun", location: "Banjara Hills" }, { quote: "Very hygienic and reliable. Staff always use gloves. Impressed with the quality.", name: "Meena", location: "Jubilee Hills" }, { quote: "Ordering on WhatsApp is easy and quick. Quality is always top-notch. Highly recommended!", name: "Farhaan", location: "Gachibowli" }
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <AnimateOnScroll animationType="fadeUp">
          <h2 className="section-title">Loved by Hyderabadis</h2>
          <p className="section-subtitle">Real, local reviews from our happy customers.</p>
        </AnimateOnScroll>
        <div className="testimonials-grid">
          {testimonialsData.map((testimonial, index) => (
            <AnimateOnScroll
              key={index}
              animationType="scaleIn"
              delay={index * 0.15}
              className="testimonial-card"
            >
              <p className="testimonial-card__quote">“{testimonial.quote}”</p>
              <footer className="testimonial-card__footer">
                <span className="testimonial-card__name">{testimonial.name}</span>
                <span className="testimonial-card__location">{testimonial.location}</span>
              </footer>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;