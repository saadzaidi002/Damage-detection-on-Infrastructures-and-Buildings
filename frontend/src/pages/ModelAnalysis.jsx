import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { Client } from '@gradio/client';

function ModelAnalysis() {
  const [formData, setFormData] = useState({
    structure_type: 'building',
    materials: ['Masonry'],
    inundation_depth: 0.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let newMaterials = [...prev.materials];
      if (checked) {
        newMaterials.push(value);
      } else {
        newMaterials = newMaterials.filter(m => m !== value);
      }
      return { ...prev, materials: newMaterials };
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const client = await Client.connect("smsaad001/buildings");
      const result = await client.predict("/predict", { 
        structure_type: formData.structure_type, 
        materials_json_str: JSON.stringify(formData.materials), 
        inundation_depth: parseFloat(formData.inundation_depth) 
      });
      
      const resultData = JSON.parse(result.data[0]);
      
      if (resultData.error) {
        throw new Error(resultData.error);
      }
      
      setResult(resultData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="page-header">
          <h1>Model Analysis</h1>
          <p>Predict Structural Damage Severity</p>
        </div>

        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <form onSubmit={handlePredict}>
          
          <div className="form-group">
            <label className="form-label">Structure Type</label>
            <select className="form-control" name="structure_type" value={formData.structure_type} onChange={handleChange}>
              <option value="building">Building</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Material(s)</label>
            <div className="checkbox-grid">
              {['Masonry', 'Reinforced concrete', 'Wood', 'Steel'].map(mat => (
                <label key={mat} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="materials" 
                    value={mat} 
                    checked={formData.materials.includes(mat)}
                    onChange={handleCheckboxChange} 
                  />
                  {mat === 'Reinforced concrete' ? 'Reinforced concrete (RC)' : mat}
                </label>
              ))}
            </div>
            {formData.materials.length === 0 && <small style={{color: 'red', marginTop: '0.5rem', display: 'block'}}>Please select at least one material.</small>}
          </div>

          <div className="form-group" style={{marginBottom: '2.5rem'}}>
            <label className="form-label">Inundation Depth (meters)</label>
            <input 
              type="number" 
              step="0.1" 
              className="form-control" 
              name="inundation_depth" 
              value={formData.inundation_depth} 
              onChange={handleChange} 
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || formData.materials.length === 0}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 size={20} />
                </motion.div>
                Predicting...
              </span>
            ) : (
              'Run Prediction'
            )}
          </button>
        </form>

        {error && (
          <div style={{color: '#EF4444', marginTop: '1.5rem', textAlign: 'center', fontWeight: '500'}}>
            Error: {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              className="result-box"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {result.is_composite && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem'}}
                >
                  <ShieldAlert size={16} />
                  <span>Composite Analysis: Worst-case scenario driven by {result.worst_material}</span>
                </motion.div>
              )}
              
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem'}}>
                {result.severity_group === 'Severe' ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontSize: '1.25rem', fontWeight: '600'}}
                  >
                    <AlertTriangle size={28} />
                    Severe Severity
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-sage)', fontSize: '1.25rem', fontWeight: '600'}}
                  >
                    <CheckCircle2 size={28} />
                    Minor Severity
                  </motion.div>
                )}
              </div>

              <motion.div 
                className="result-grade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Grade {result.predicted_grade}
              </motion.div>
              
              <motion.div 
                className="result-confidence"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Confidence: {result.confidence}% 
                <span style={{color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.875rem', marginLeft: '0.5rem'}}>
                  (General {result.severity_group} classification: {result.master_confidence}%)
                </span>
              </motion.div>
              
              <motion.div 
                className="result-explanation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <strong style={{color: 'var(--primary-navy)', display: 'block', marginBottom: '0.5rem'}}>EMS-98 Definition:</strong>
                <p style={{color: 'var(--text-dark)', lineHeight: '1.6', margin: 0}}>{result.explanation}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default ModelAnalysis;
