import React, { useEffect, useState } from 'react';
import { Download, FileText, Filter, Eye, X, CheckCircle2, AlertTriangle, Printer, Calendar, MapPin, Activity } from 'lucide-react';
import { fetchReportsData } from '../api/api';

function formatConditionName(rawName) {
  if (!rawName) return 'N/A';
  if (rawName.includes('___')) {
    const parts = rawName.split('___');
    const crop = parts[0].replace(/_/g, ' ').trim();
    const cond = parts[1].replace(/_/g, ' ').replace(/\(/g, ' (').trim();
    return `${crop} — ${cond}`;
  }
  return rawName.replace(/_/g, ' ');
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchReportsData();
        setReports(data);
      } catch (err) {
        console.error('Reports load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (cropFilter !== 'All' && r.crop !== cropFilter) return false;
    if (diseaseFilter && !formatConditionName(r.detected_condition).toLowerCase().includes(diseaseFilter.toLowerCase())) return false;
    if (dateFilter && !r.date.includes(dateFilter)) return false;
    if (riskFilter !== 'All') {
      const isHigh = r.health_score < 70 || r.status === 'Unseen Pattern';
      const isMed = r.health_score >= 70 && r.health_score < 85;
      const isLow = r.health_score >= 85;
      if (riskFilter === 'High' && !isHigh) return false;
      if (riskFilter === 'Medium' && !isMed) return false;
      if (riskFilter === 'Low' && !isLow) return false;
    }
    return true;
  });

  const exportCSV = () => {
    if (filteredReports.length === 0) return;
    const headers = ['ID', 'Date', 'Field', 'Crop', 'Condition', 'Confidence', 'Status', 'Health Score', 'Verification'];
    const rows = filteredReports.map(r => [
      r.id,
      `"${r.date}"`,
      `"${r.field}"`,
      `"${r.crop}"`,
      `"${formatConditionName(r.detected_condition)}"`,
      `"${r.confidence}"`,
      `"${r.status}"`,
      r.health_score,
      `"${r.verification_status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CropNexia_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSingleReport = () => {
    if (!selectedReport) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>CropNexia Inspection Report #${selectedReport.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; color: #1e293b; }
            h1 { color: #15803d; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; font-size: 0.9rem; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 6px; }
            .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 99px; font-weight: bold; background: #e2e8f0; }
          </style>
        </head>
        <body>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 1.5rem;">
            <img src="/favicon.svg" alt="CropNexia Logo" style="height: 54px; width: 54px; background: #000; border-radius: 50%; object-fit: cover;" />
            <div>
              <h1 style="margin: 0; color: #15803d; border-bottom: none; padding-bottom: 0;">CropNexia Leaf Inspection Report #${selectedReport.id}</h1>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.85rem;">Smart Farming. Healthier Future. — AI Digital Twin</p>
            </div>
          </div>
          <div class="meta">
            <div><strong>Date & Time:</strong> ${selectedReport.date}</div>
            <div><strong>Field Plot:</strong> ${selectedReport.field} (${selectedReport.crop})</div>
            <div><strong>Detected Condition:</strong> ${formatConditionName(selectedReport.detected_condition)}</div>
            <div><strong>Model Confidence:</strong> ${selectedReport.confidence}</div>
            <div><strong>Status:</strong> ${selectedReport.status}</div>
            <div><strong>Health Index:</strong> ${selectedReport.health_score}%</div>
            <div><strong>Verification:</strong> ${selectedReport.verification_status}</div>
          </div>
          <p>Generated via CropNexia Agricultural AI Digital Twin Monitoring System.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Field Inspection Reports & Audit Trail</h1>
          <p className="page-subtitle">Detailed diagnostic records, open-set pattern alerts, and exportable datasets</p>
        </div>
        <button onClick={exportCSV} className="btn btn-primary">
          <Download size={16} />
          <span>Export CSV Dataset</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span>Filter Observations:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px', padding: '0.35rem 0.625rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Known Condition">Known Condition</option>
              <option value="Unseen Pattern">Unseen Pattern</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Crop:</span>
            <select
              className="form-select"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              style={{ width: '130px', padding: '0.35rem 0.625rem' }}
            >
              <option value="All">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Corn">Corn</option>
              <option value="Potato">Potato</option>
              <option value="Cherry">Cherry</option>
              <option value="Apple">Apple</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Disease:</span>
            <input
              type="text"
              className="form-input"
              placeholder="Search condition..."
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              style={{ width: '140px', padding: '0.35rem 0.625rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Date:</span>
            <input
              type="text"
              className="form-input"
              placeholder="YYYY-MM-DD"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '120px', padding: '0.35rem 0.625rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Risk:</span>
            <select
              className="form-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{ width: '120px', padding: '0.35rem 0.625rem' }}
            >
              <option value="All">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Field Plot</th>
              <th>Crop</th>
              <th>Detected Condition</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Sample Health Index</th>
              <th>Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}>Loading Diagnostic Records...</td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No matching inspection reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr
                  key={r.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedReport(r)}
                >
                  <td><strong>#{r.id}</strong></td>
                  <td>{r.date}</td>
                  <td><strong>{r.field}</strong></td>
                  <td>{r.crop}</td>
                  <td>{formatConditionName(r.detected_condition)}</td>
                  <td><strong>{r.confidence}</strong></td>
                  <td>
                    <span className={`badge ${r.status === 'Known Condition' ? 'badge-success' : 'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td><strong>{r.health_score}%</strong></td>
                  <td>
                    <span className={`badge ${r.verification_status === 'Verified' || r.verification_status === 'Not Required' ? 'badge-success' : 'badge-warning'}`}>
                      {r.verification_status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      onClick={(e) => { e.stopPropagation(); setSelectedReport(r); }}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Individual Report Detailed Modal */}
      {selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Inspection Report #{selectedReport.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Leaf Image Thumbnail */}
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={selectedReport.image_url?.startsWith('/uploads') ? selectedReport.image_url : `/uploads/sample_tomato_leaf.jpg`}
                    alt="Analyzed Crop Leaf"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/uploads/sample_tomato_leaf.jpg';
                    }}
                  />
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={14} />
                    <span>Logged Date: <strong>{selectedReport.date}</strong></span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <MapPin size={14} />
                    <span>Field Plot: <strong>{selectedReport.field} ({selectedReport.crop})</strong></span>
                  </div>

                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    {formatConditionName(selectedReport.detected_condition)}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    <span className={`badge ${selectedReport.status === 'Known Condition' ? 'badge-success' : 'badge-warning'}`}>
                      {selectedReport.status}
                    </span>
                    <span className={`badge ${selectedReport.verification_status === 'Verified' || selectedReport.verification_status === 'Not Required' ? 'badge-success' : 'badge-warning'}`}>
                      Verification: {selectedReport.verification_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Metrics Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Model Confidence</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-accent)', marginTop: '0.25rem' }}>
                    {selectedReport.confidence}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample Health Index</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    {selectedReport.health_score}%
                  </div>
                </div>

                <div style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Status</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: selectedReport.status === 'Unseen Pattern' ? '#b45309' : '#15803d', marginTop: '0.25rem' }}>
                    {selectedReport.status === 'Unseen Pattern' ? 'Unverified Risk' : 'Low-Medium Risk'}
                  </div>
                </div>
              </div>

              {/* Distinction note between Field Health and Sample Health Index */}
              <div style={{ padding: '0.75rem 0.875rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '0.75rem', color: '#166534', marginBottom: '1rem' }}>
                💡 <strong>Metrics Explanation:</strong> <em>Sample Health Index</em> ({selectedReport.health_score}%) measures this specific leaf image sample (95% for healthy leaves). <em>Overall Field Health</em> (72%) represents the composite health score aggregated across all farm plot zones.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button onClick={handlePrintSingleReport} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <Printer size={16} />
                <span>Print Single Report</span>
              </button>

              <button onClick={() => setSelectedReport(null)} className="btn btn-primary">
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
