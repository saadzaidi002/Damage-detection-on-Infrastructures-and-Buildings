import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function Overview() {
  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Overview</h1>
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2>About The System</h2>
        <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
          This application predicts structural damage to buildings and infrastructure caused by severe flood events and inundation.
          By analyzing the physical characteristics of a structure, such as its primary construction Material and the exact Inundation Depth, the system calculates the precise vulnerability of the target asset.
        </p>
        <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
          Under the hood, the backend leverages a sophisticated ensemble of Machine Learning models. It first utilizes a "Master" Random Forest Classifier to route the data into either a Minor or Severe category. From there, specialized sub-models predict the precise damage grade based on historical training data. The system is also capable of performing Composite Analysis: if a structure contains multiple materials, the engine mathematically determines the worst-case scenario.
        </p>
        <p style={{color: 'var(--text-muted)'}}>
          The resulting predictions correspond directly to the widely recognized European Macroseismic Scale (EMS-98). This standardization allows civil engineers, urban planners, and disaster responders to translate predictive data into actionable, real-world structural assessments.
        </p>
      </motion.div>

      <div className="overview-grid">
        <motion.div 
          className="card scale-card" 
          style={{height: '100%'}}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-sage)'}}>
            <CheckCircle2 size={24} />
            <h3 style={{margin: 0, color: 'var(--primary-navy)'}}>Minor Damage Grades</h3>
          </div>
          <ul style={{listStyleType: 'none'}}>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 0:</strong> <span style={{color: 'var(--text-muted)'}}>No damage. No visible issues.</span></li>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 1:</strong> <span style={{color: 'var(--text-muted)'}}>Slight damage. Hairline cracks or minor issues.</span></li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="card scale-card" 
          style={{height: '100%'}}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-amber)'}}>
            <AlertTriangle size={24} />
            <h3 style={{margin: 0, color: 'var(--primary-navy)'}}>Severe Damage Grades</h3>
          </div>
          <ul style={{listStyleType: 'none'}}>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 2:</strong> <span style={{color: 'var(--text-muted)'}}>Moderate damage. Notable cracking and partial failures.</span></li>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 3:</strong> <span style={{color: 'var(--text-muted)'}}>Heavy damage. Extensive cracks, non-structural partitions fail.</span></li>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 4:</strong> <span style={{color: 'var(--text-muted)'}}>Very heavy damage. Serious structural failure.</span></li>
            <li><strong style={{color: 'var(--primary-navy)'}}>Grade 5:</strong> <span style={{color: 'var(--text-muted)'}}>Destruction. Total collapse.</span></li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default Overview;
