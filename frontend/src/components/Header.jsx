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
      {/* Field Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Selected Field:</span>
        <select
          value={selectedField}
          onChange={(e) => onSelectField(e.target.value)}
          className="form-select"
          style={{ width: '220px', padding: '0.4rem 0.75rem', fontWeight: '600' }}
        >
          <option value="1">Tomato Field 01 (Tomato)</option>
          <option value="2">Corn Field 02 (Maize)</option>
          <option value="3">Potato Field 03 (Potato)</option>
        </select>
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
