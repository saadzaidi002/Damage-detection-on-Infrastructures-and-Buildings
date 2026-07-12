import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

function About() {
  return (
    <div>
      <div className="page-header">
        <h1>About</h1>
        <p>Meet the Developer</p>
      </div>

      <div className="card">
        <div className="about-grid">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-image-container">
              <img src="/profile.jpeg" alt="Syed Muhammad Saad Hussain Zaidi" />
            </div>
            
            <div style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
              <a href="https://www.linkedin.com/in/s-m-saad-a9a238299/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                <FaLinkedin size={22} />
              </a>
              <a href="https://www.instagram.com/s.m.saad002/?hl=en" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <FaInstagram size={22} />
              </a>
              <a href="https://www.facebook.com/syed.saad.856366" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <FaFacebook size={22} />
              </a>
            </div>
          </motion.div>
          
          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="about-name">Syed Muhammad Saad Hussain Zaidi</h2>
            <div className="about-title">Data Scientist | Physicist | Web Developer</div>
            
            <p style={{marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--text-muted)'}}>
              Hello! I am a multi-disciplinary professional bridging the gap between rigorous scientific analysis and modern software development.
            </p>

            <div className="about-section">
              <h3>My Expertise</h3>
              <ul className="modern-list">
                <li><strong>Physics:</strong> Grounded in analytical thinking, problem-solving, and understanding complex systems.</li>
                <li><strong>Data Science:</strong> Specialized in Machine Learning, Deep Learning (ANNs), and predictive modeling to extract actionable insights from raw data.</li>
                <li><strong>Web Development:</strong> Capable of turning complex backend logic and models into intuitive, user-friendly web applications.</li>
              </ul>
            </div>

            <div className="about-section" style={{marginTop: '2.5rem'}}>
              <h3>About This Project</h3>
              <p style={{color: 'var(--text-dark)', marginTop: '1rem'}}>
                This Structural Damage Prediction System was built to demonstrate how advanced Machine Learning (combining Random Forests and Neural Networks) can be seamlessly integrated into a web interface to solve real-world engineering and safety problems.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}

export default About;
