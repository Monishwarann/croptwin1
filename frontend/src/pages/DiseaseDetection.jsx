import React, { useState } from 'react';
import { Upload, Stethoscope, RefreshCw, FileImage } from 'lucide-react';
import { analyzeImage } from '../api/api';
import PredictionCard from '../components/PredictionCard';

export default function DiseaseDetection({ selectedField }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [threshold, setThreshold] = useState(0.70);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid leaf image file (.jpg, .png, .jpeg)');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('field_id', selectedField);
    formData.append('threshold', threshold);

    try {
      const res = await analyzeImage(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Unable to analyze this image. Please upload a clear crop-leaf image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Disease Detection & Open-Set Classification</h1>
        <p className="page-subtitle">Upload crop leaf imagery for deep learning analysis (38-class PlantVillage dataset standard)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Image Uploader Form */}
        <div className="card">
          <h3 className="card-title">
            <Upload size={18} color="var(--color-accent)" />
            <span>Image Upload & Open-Set Settings</span>
          </h3>

          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '0.8125rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">Crop Leaf Image</label>
              <div
                onClick={() => document.getElementById('leaf-file-input').click()}
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: '8px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {preview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src={preview}
                      alt="Selected Leaf Preview"
                      style={{ maxHeight: '180px', borderRadius: '6px', objectFit: 'contain', marginBottom: '0.75rem' }}
                    />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Click to change image ({file?.name})</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FileImage size={40} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>Click to upload leaf image</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Supports JPG, PNG (Max 10MB)</span>
                  </div>
                )}
              </div>
              <input
                id="leaf-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Advanced Model Details Collapsible Section */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.625rem', width: '100%', justifyContent: 'space-between' }}
              >
                <span>⚙ Advanced Model Details & Calibration</span>
                <span>{showAdvanced ? '▲ Hide' : '▼ Expand'}</span>
              </button>

              {showAdvanced && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.875rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <label className="form-label" style={{ margin: 0, fontSize: '0.8125rem' }}>Open-Set Decision Threshold</label>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--color-accent)' }}>{(threshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.95"
                    step="0.05"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    Calibrated open-set confidence boundary (Default: 70%). Predictions below this threshold are flagged as "Unseen Pattern Detected".
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Evaluating Model & Open-Set Engine...</span>
                </>
              ) : (
                <>
                  <Stethoscope size={16} />
                  <span>Analyze Crop Leaf</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Result */}
        <div>
          {result ? (
            <PredictionCard result={result} />
          ) : (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Stethoscope size={36} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Analysis Result</h4>
              <p style={{ fontSize: '0.8125rem' }}>Select an image and click "Analyze Crop Leaf" to view diagnosis metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
