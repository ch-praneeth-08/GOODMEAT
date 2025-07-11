import React, { useState } from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    const whatsappNumber = '917981692303';

    // --- NEW, PROFESSIONALLY FORMATTED MESSAGE ---
    // We use asterisks (*) for bolding in WhatsApp.
    const textMessage = `
Hello! I have an inquiry from the GoodMeat website.

*Name:* ${formData.name}
*Email:* ${formData.email}

*Message:*
${formData.message}
    `;

    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="container contact__container">
        <AnimateOnScroll animationType="fadeUp">
          <div className="contact__text">
            <h2 className="section-title">Connect with GoodMeat</h2>
            <p className="section-subtitle">Have a question or a special request? Send us a message!</p>
          </div>
          
          <form onSubmit={handleWhatsAppRedirect} className="contact__form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Jane Smith" required value={formData.name} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="jane@example.com" required value={formData.email} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Your message..." required value={formData.message} onChange={handleChange}></textarea>
            </div>
            <div className="form-button-container">
              <button type="submit" className="btn btn--primary">
                Your Message
              </button>
            </div>
          </form>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default ContactForm;