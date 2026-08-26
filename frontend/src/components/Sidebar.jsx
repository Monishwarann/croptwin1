import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, AlertTriangle, TrendingUp, Cpu, FileText, Sprout, User } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Disease Detection', path: '/detection', icon: Stethoscope },
    { name: 'Unknown Conditions', path: '/unknowns', icon: AlertTriangle },
    { name: 'Forecast', path: '/forecast', icon: TrendingUp },
    { name: 'Digital Twin', path: '/digital-twin', icon: Cpu },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      borderRight: '1px solid #334155'
    }}>
      {/* App Branding */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Sprout size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#ffffff' }}>CropTwin</h1>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Digital Twin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.75rem', fontWeight: '600' }}>
          Navigation
        </div>
        <ul style={{ listStyle: 'none', marginTop: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} style={{ marginBottom: '0.25rem' }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
}
