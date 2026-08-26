import React, { useState } from 'react';
import { User, Mail, Shield, MapPin, Save, CheckCircle2, Sliders, Bell, Globe, Camera } from 'lucide-react';

export default function Profile({ user, onUpdateUser, selectedField, onSelectField }) {
  const [name, setName] = useState(user?.username || 'Researcher User');
  const [email, setEmail] = useState(user?.email || 'researcher@croptwin.org');
  const [role, setRole] = useState(user?.role || 'Lead Agronomist & AI Researcher');
  const [station, setStation] = useState(user?.station || 'North Field Research Station');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [tempUnit, setTempUnit] = useState('Celsius (°C)');
  const [defaultThreshold, setDefaultThreshold] = useState(0.75);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      username: name,
      email: email,
      role: role,
      station: station,
      phone: phone,
    };
    onUpdateUser(updated);
    setSavedSuccess('Profile and customized system preferences saved successfully!');
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">User Profile & System Preferences</h1>
        <p className="page-subtitle">Customize personal details, research station credentials, and AI engine default parameters</p>
      </div>

      {savedSuccess && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          color: '#166534',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <CheckCircle2 size={20} color="#166534" />
          <span>{savedSuccess}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Avatar & Overview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 1.25rem auto' }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px rgba(27, 94, 32, 0.3)'
              }}>
                {name ? name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '50%',
                padding: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)'
              }} title="Upload profile picture">
                <Camera size={14} color="var(--text-main)" />
              </div>
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
              {name}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: '600', margin: '0 0 0.75rem 0' }}>
              {role}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: user?.authProvider?.includes('firebase') ? '#f0fdf4' : '#eff6ff',
              color: user?.authProvider?.includes('firebase') ? '#15803d' : '#1d4ed8',
              border: `1px solid ${user?.authProvider?.includes('firebase') ? '#bbf7d0' : '#bfdbfe'}`
            }}>
              <Shield size={12} />
              <span>{user?.authProvider?.includes('firebase') ? 'Firebase Auth Verified' : 'Standard Session'}</span>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Mail size={15} color="var(--color-accent)" />
                <span style={{ color: 'var(--text-main)' }}>{email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <MapPin size={15} color="var(--color-accent)" />
                <span style={{ color: 'var(--text-main)' }}>{station}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form & Customization Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <form onSubmit={handleSave}>
            {/* Personal Information */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
                <User size={18} color="var(--color-accent)" />
                <span>Personal & Professional Information</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role / Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Research Station / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Custom AI & Interface Preferences */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
                <Sliders size={18} color="var(--color-accent)" />
                <span>Custom System & AI Preferences</span>
              </h3>

              <div className="form-group">
                <label className="form-label">Active Monitored Field Plot</label>
                <select
                  className="form-select"
                  value={selectedField}
                  onChange={(e) => onSelectField(e.target.value)}
                >
                  <option value="1">Tomato Field 01 (Tomato)</option>
                  <option value="2">Corn Field 02 (Maize)</option>
                  <option value="3">Potato Field 03 (Potato)</option>
                </select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Default Open-Set Confidence Threshold</label>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--color-accent)' }}>{(defaultThreshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.05"
                  value={defaultThreshold}
                  onChange={(e) => setDefaultThreshold(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Image classification results below this threshold will automatically flag "Unseen Pattern" alerts.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Temperature Display Unit</label>
                  <select
                    className="form-select"
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value)}
                  >
                    <option value="Celsius (°C)">Celsius (°C)</option>
                    <option value="Fahrenheit (°F)">Fahrenheit (°F)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Unseen Condition Email Alerts</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                    <input
                      type="checkbox"
                      id="email-alert-toggle"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="email-alert-toggle" style={{ fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      Send instant notification when unseen pattern detected
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={18} />
              <span>Save Custom Profile & Preferences</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
