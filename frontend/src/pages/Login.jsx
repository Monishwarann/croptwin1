import React, { useState } from 'react';
import { Sprout, Lock, Mail, Shield } from 'lucide-react';
import { loginUser } from '../api/api';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from '../firebase';

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('researcher');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Firebase Email/Password Registration
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, emailOrUsername, password);
          const user = userCredential.user;
          onLoginSuccess({
            username: user.email || user.displayName || 'Firebase Researcher',
            token: user.accessToken || 'firebase-token',
            authProvider: 'firebase'
          });
        } catch (fbErr) {
          if (fbErr.code === 'auth/operation-not-allowed') {
            setError("Email/Password Sign-In is not enabled in your Firebase Console (dog7-8ca5d). Please enable Email/Password under Authentication -> Sign-in Method, or sign in using prototype credentials.");
          } else {
            throw fbErr;
          }
        }
      } else {
        // Attempt Firebase Email Sign In if input contains '@'
        if (emailOrUsername.includes('@')) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername, password);
            const user = userCredential.user;
            onLoginSuccess({
              username: user.email || user.displayName || 'Firebase Researcher',
              token: user.accessToken || 'firebase-token',
              authProvider: 'firebase'
            });
            return;
          } catch (fbErr) {
            if (fbErr.code === 'auth/operation-not-allowed') {
              console.warn("Firebase Email/Password disabled, attempting prototype API fallback.");
            } else if (fbErr.code !== 'auth/user-not-found' && fbErr.code !== 'auth/wrong-password') {
              console.warn("Firebase sign in failed:", fbErr.message);
            }
          }
        }

        // Prototype API Authentication Fallback
        const res = await loginUser(emailOrUsername, password);
        onLoginSuccess({
          ...res,
          authProvider: 'backend'
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLoginSuccess({
        username: user.displayName || user.email,
        email: user.email,
        token: user.accessToken,
        authProvider: 'google-firebase'
      });
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is not enabled in your Firebase Console (dog7-8ca5d). To use Google Sign-In, enable 'Google' under Firebase Console -> Authentication -> Sign-in Method. Otherwise, sign in using default credentials below.");
      } else {
        setError('Google Authentication failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.25)'
          }}>
            <Sprout size={30} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: 'var(--text-main)' }}>CropTwin AI Portal</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Firebase Protected Agricultural Digital Twin
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: !isSignUp ? '#ffffff' : 'transparent',
              color: !isSignUp ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: !isSignUp ? '600' : '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: !isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(''); setPassword(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isSignUp ? '#ffffff' : 'transparent',
              color: isSignUp ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: isSignUp ? '600' : '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '0.875rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#b91c1c',
            fontSize: '0.8125rem',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{isSignUp ? 'Email Address' : 'Username / Email'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={isSignUp ? "email" : "text"}
                className="form-input"
                placeholder={isSignUp ? "researcher@croptwin.org" : "researcher"}
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                style={{ paddingLeft: '2.25rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.25rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Firebase Account' : 'Sign In to Dashboard')}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.625rem',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            backgroundColor: '#ffffff',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.15s ease'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
