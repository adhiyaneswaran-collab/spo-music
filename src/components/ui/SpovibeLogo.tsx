'use client';

import React from 'react';
import Image from 'next/image';

interface SpovibeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export function SpovibeLogo({ size = 'md', variant = 'full', className = '' }: SpovibeLogoProps) {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const h = sizes[size];
  // The user's logo is landscape, so width should be wider than height
  const w = h * 2.5; 

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative overflow-hidden flex-shrink-0" style={{ width: variant === 'icon' ? h : w, height: h }}>
        <Image 
          src="/logo-custom.jpg" 
          alt="SPOVIBE Logo" 
          fill 
          className="object-contain" 
        />
      </div>
    </div>
  );
}
