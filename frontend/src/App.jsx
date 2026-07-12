import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Overview from './pages/Overview';
import ModelAnalysis from './pages/ModelAnalysis';
import About from './pages/About';
import { Home, Activity, User } from 'lucide-react';

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update spotlight effect on cards
      document.querySelectorAll('.card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;
        
        const maxDist = 350;
        
        const setCornerOpacity = (cornerX, cornerY, prefix) => {
          const dx = x - cornerX;
          const dy = y - cornerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let op1 = 0;
          let op2 = 0;
          
          if (dist < maxDist) {
            const intensity = 1 - (dist / maxDist);
            // Non-linear easing for smoother fade
            const smoothIntensity = intensity * intensity;
            op1 = 0.5 * smoothIntensity;
            op2 = 0.3 * smoothIntensity;
          }
          
          card.style.setProperty(`--${prefix}-1`, op1.toFixed(3));
          card.style.setProperty(`--${prefix}-2`, op2.toFixed(3));
        };

        setCornerOpacity(0, 0, 'tl');
        setCornerOpacity(w, 0, 'tr');
        setCornerOpacity(0, h, 'bl');
        setCornerOpacity(w, h, 'br');
      });
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'select' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.card')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor ${hovering ? 'hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Overview
        </NavLink>
        <NavLink to="/analysis" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Model Analysis
        </NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          About
        </NavLink>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="main-header">
      <div className="header-brand">
        <img src="/bg-logo.png" alt="Logo" style={{height: '40px', width: 'auto'}} />
        <span>Structural Damage Prediction</span>
      </div>
      <Navbar />
    </header>
  );
}

function App() {
  return (
    <Router>
      <CustomCursor />
      <div className="app-container">
        <Header />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analysis" element={<ModelAnalysis />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
