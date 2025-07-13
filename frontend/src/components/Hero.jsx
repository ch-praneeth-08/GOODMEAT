import React, { useEffect } from 'react';
import './Hero.css';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Hero() {
  // --- PROFESSIONAL MESSAGE ---
  const professionalMessage = "Hello! I'd like to place an order with GoodMeat.";
  const WHATSAPP_URL = `https://wa.me/917981692303?text=${encodeURIComponent(professionalMessage)}`;
  
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2, }, }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }, };

  // Scroll to top when Hero mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="hero" className="hero">
      <motion.div className="container hero__container" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 className="hero__title" variants={itemVariants}>GOODMEAT</motion.h1>
        <motion.h2 className="hero__tagline" variants={itemVariants}>Handled with Hygiene. Delivered Fresh.</motion.h2>
        <motion.div className="hero__buttons" variants={itemVariants}>
          <a href={WHATSAPP_URL} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            <span>Order on WhatsApp</span>
          </a>
          <a href="#features" className="btn btn--secondary">
            Our Process
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;