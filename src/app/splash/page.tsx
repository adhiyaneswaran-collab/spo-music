'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Show 'ENJOY WHAT YOU LOVE' for 3 seconds, then redirect to home
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-black w-full"
      style={{ overflow: 'hidden' }}
    >
      {/* Black & Green 3D Animated Background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom right, #000000, #0a1f10, #000000)',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(0, 255, 128, 0.15) 0%, rgba(0, 255, 128, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float1 15s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(0, 200, 100, 0.1) 0%, rgba(0, 200, 100, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float2 20s ease-in-out infinite reverse',
        }} />
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(5%, 10%) scale(1.1); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-10%, -5%) scale(1.2); }
          }
        `}</style>
      </div>

      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
          zIndex: 10,
        }}
      >
        <h1 
          style={{
            fontSize: 'clamp(60px, 12vw, 120px)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '0.2em',
            animation: 'fadeInScale 2.5s ease-out forwards',
            textShadow: '0 0 40px rgba(0,255,128,0.5)',
            lineHeight: 1.2
          }}
        >
          ENJOY
        </h1>
      </div>
    </div>
  );
}
