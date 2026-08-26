import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import UnknownConditions from './pages/UnknownConditions';
import Forecast from './pages/Forecast';
import DigitalTwin from './pages/DigitalTwin';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import { auth, onAuthStateChanged, signOut } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState('1');

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          token: firebaseUser.accessToken || 'firebase-session-token',
          authProvider: 'firebase'
        });
      } else {
        // Keep non-firebase logged in state if user logged in via prototype API credentials
        setUser((prev) => (prev?.authProvider === 'backend' ? prev : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign out error:', err);
    }
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        Initializing Firebase Security Layer...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Body */}
      <div className="main-content">
        <Header
          user={user}
          selectedField={selectedField}
          onSelectField={(id) => setSelectedField(id)}
          onLogout={handleLogout}
        />

        {/* Application Page Routing */}
        <Routes>
          <Route path="/" element={<Dashboard selectedField={selectedField} />} />
          <Route path="/detection" element={<DiseaseDetection selectedField={selectedField} />} />
          <Route path="/unknowns" element={<UnknownConditions />} />
          <Route path="/forecast" element={<Forecast selectedField={selectedField} />} />
          <Route path="/digital-twin" element={<DigitalTwin selectedField={selectedField} />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onUpdateUser={(updated) => setUser(updated)}
                selectedField={selectedField}
                onSelectField={(id) => setSelectedField(id)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
