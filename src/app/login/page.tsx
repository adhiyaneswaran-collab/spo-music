'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidName = name.trim().length > 0;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isValidName) {
      setUser({
        userId: `local_${Date.now()}`,
        phoneNumber: '0000000000',
        name: name.trim(),
      });
      router.push('/splash');
    }
  };

  if (!mounted) return null;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen w-full relative"
      style={{ 
        backgroundColor: '#111113', 
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20, 30, 25, 0.5) 0%, #111113 70%)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background star */}
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', opacity: 0.2 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"/>
        </svg>
      </div>

      <div 
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#1c1c1e',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(255,255,255,0.02)'
        }}
      >
        {/* Neon Green Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <svg width="80" height="60" viewBox="0 0 100 60" fill="none" style={{ filter: 'drop-shadow(0 0 8px #00ff66)' }}>
              {/* Heartbeat Line */}
              <path d="M10 30 L25 30 L35 15 L45 45 L55 20 L65 30 L90 30" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Music Note */}
              <path d="M50 15 V40 C50 43 47 45 44 45 C41 45 38 43 38 40 C38 37 41 35 44 35 C46 35 48 36 49 38" stroke="#00ff66" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M50 20 C55 20 60 25 60 30" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 
            style={{
              fontFamily: "'Syncopate', 'Inter', sans-serif",
              fontSize: '28px',
              fontWeight: 800,
              color: '#00ff66',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(0, 255, 102, 0.6)',
              margin: 0
            }}
          >
            SPOVIBE
          </h1>
        </div>

        <p style={{ color: '#8e8e93', textAlign: 'center', fontSize: '15px', marginBottom: '32px' }}>
          Please enter your name to continue to your account.
        </p>

        <form onSubmit={handleLogin} className="w-full">
          {/* Input Box */}
          <div 
            style={{
              position: 'relative',
              background: '#0d0d0f',
              borderRadius: '12px',
              border: isValidName ? '1px solid #00ff66' : '1px solid rgba(0, 255, 102, 0.3)',
              boxShadow: isValidName ? '0 0 15px rgba(0, 255, 102, 0.2)' : 'none',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              transition: 'all 0.3s ease'
            }}
          >
            {/* User Icon */}
            <div style={{ color: '#00ff66', opacity: 0.8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ff66', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 500,
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            {/* Clear Button */}
            {name && (
              <button 
                type="button"
                onClick={() => setName('')}
                style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer', padding: 4 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Remember me checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div 
              style={{ 
                width: 20, height: 20, borderRadius: 4, background: '#00ff66', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span style={{ color: '#e5e5ea', fontSize: '14px' }}>Remember my name</span>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#00ff66',
              color: '#000000',
              padding: '16px',
              borderRadius: '99px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: isValidName ? 'pointer' : 'not-allowed',
              opacity: isValidName ? 1 : 0.5,
              boxShadow: isValidName ? '0 0 30px rgba(0, 255, 102, 0.4)' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '24px'
            }}
            disabled={!isValidName}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#8e8e93', fontSize: '14px', marginBottom: '40px' }}>
          Don't have an account? <span style={{ color: '#00ff66', fontWeight: 600, cursor: 'pointer' }}>Sign Up</span>
        </div>

        <div style={{ textAlign: 'center', color: '#636366', fontSize: '12px' }}>
          © 2024. All rights reserved.
        </div>
      </div>
    </div>
  );
}
