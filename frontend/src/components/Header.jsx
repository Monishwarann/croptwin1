import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Header({ user, selectedField, onSelectField, onLogout }) {

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-subtle)'
    }}>
      {/* Title & Field Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
          }}>
            <img src="/logo.png" alt="CropNexia Logo" style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>CropNexia</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.75rem', borderLeft: '1px solid #cbd5e1', paddingLeft: '0.75rem' }}>
              AI-powered Crop Health Monitoring
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-muted)' }}>Field:</span>
          <select
            value={selectedField}
            onChange={(e) => onSelectField(e.target.value)}
            className="form-select"
            style={{ width: '200px', padding: '0.35rem 0.625rem', fontSize: '0.8125rem', fontWeight: '600' }}
          >
            <option value="1">Tomato Field 01 (Tomato)</option>
            <option value="2">Corn Field 02 (Maize)</option>
            <option value="3">Potato Field 03 (Potato)</option>
          </select>
        </div>
      </div>

      {/* User Profile / Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.875rem'
          }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
              {user?.username || 'Researcher User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {user?.role || 'Agronomist Role'}
            </div>
          </div>
        </Link>

        <button
          onClick={onLogout}
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
          title="Log out"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
