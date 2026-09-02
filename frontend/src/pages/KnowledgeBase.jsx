import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Filter, ShieldCheck, Cpu, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchKnowledgeBase } from '../api/api';

export default function KnowledgeBase() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchKnowledgeBase();
        setEntries(data || []);
      } catch (err) {
        console.error('Error loading knowledge base:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      (item.crop && item.crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.condition && item.condition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.symptoms && item.symptoms.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCrop = cropFilter === 'All' || item.crop === cropFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Verified' && item.verification_status?.includes('Verified')) ||
      (statusFilter === 'Pre-trained' && item.verification_status?.includes('Pre-trained'));
    return matchesSearch && matchesCrop && matchesStatus;
  });

  const cropsList = Array.from(new Set(entries.map((e) => e.crop))).filter(Boolean);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Self-Evolving Knowledge Base</h1>
        <p className="page-subtitle">
          Repository of known PlantVillage crop health patterns and expert-verified emerging conditions
        </p>
      </div>

      {/* Self-Evolving Workflow Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <h3 className="card-title" style={{ color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/favicon.svg" alt="CropNexia Icon" style={{ width: '24px', height: '24px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', objectFit: 'cover' }} />
          <span>Self-Evolving AI Model Pipeline</span>
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#15803d', marginBottom: '1rem', lineHeight: '1.5' }}>
          When the deep-learning model encounters an unverified leaf pattern, expert feedback is recorded in SQLite and automatically added to this Knowledge Base. These ground-truth entries form the dataset for future model fine-tuning cycles.
        </p>

        {/* Visual Workflow Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: '600', color: '#166534' }}>
            Crop Image
          </div>
          <ArrowRight size={16} color="var(--color-accent)" style={{ justifySelf: 'center' }} />
          <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: '600', color: '#166534' }}>
            AI Analysis
          </div>
          <ArrowRight size={16} color="var(--color-accent)" style={{ justifySelf: 'center' }} />
          <div style={{ padding: '0.5rem', backgroundColor: '#fffbe6', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: '600', color: '#92400e' }}>
            Unseen Pattern
          </div>
          <ArrowRight size={16} color="var(--color-accent)" style={{ justifySelf: 'center' }} />
          <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: '600', color: '#166534' }}>
            Expert Verification
          </div>
        </div>

        <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#166534' }}>
          <RefreshCw size={14} />
          <span>Note: Model retraining is currently scheduled as a planned / experimental offline batch pipeline.</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by crop, disease name, or symptom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Crop Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Crop:</span>
            <select
              className="form-select"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              style={{ width: '150px', padding: '0.35rem 0.625rem' }}
            >
              <option value="All">All Crops</option>
              {cropsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px', padding: '0.35rem 0.625rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pre-trained">Pre-trained Standard</option>
              <option value="Verified">Verified Ground-Truth</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Display */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop</th>
              <th>Disease / Condition</th>
              <th>Symptoms</th>
              <th>Severity</th>
              <th>Source</th>
              <th>Date Added</th>
              <th>Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading Knowledge Base Entries...
                </td>
              </tr>
            ) : filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No knowledge base records match your criteria.
                </td>
              </tr>
            ) : (
              filteredEntries.map((item) => (
                <tr key={item.id}>
                  <td><strong>#{item.id}</strong></td>
                  <td><strong>{item.crop}</strong></td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.condition}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                    {item.symptoms || 'Standard leaf lesion symptoms'}
                  </td>
                  <td>
                    <span className={`badge ${item.severity === 'High' || item.severity === 'Critical' ? 'badge-danger' : (item.severity === 'Medium' ? 'badge-warning' : 'badge-success')}`}>
                      {item.severity || 'Medium'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.source || 'EfficientNet Pre-trained'}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{item.date_added ? new Date(item.date_added).toLocaleDateString() : 'Baseline'}</td>
                  <td>
                    <span className={`badge ${item.verification_status?.includes('Verified') ? 'badge-success' : 'badge-info'}`}>
                      {item.verification_status || 'Pre-trained Standard'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
