'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
}

export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isRightClickDragging = useRef(false);

  const PULL_THRESHOLD = 80;

  // Touch Events for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      setPullDistance(Math.min(diff, PULL_THRESHOLD * 1.5));
      if (e.cancelable) e.preventDefault(); // Prevent default scroll when pulling down at top
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      triggerRefresh();
    } else {
      reset();
    }
  };

  // Mouse Events for Desktop (Right-click drag)
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Check for right click (button 2)
      if (e.button === 2 && window.scrollY === 0) {
        isRightClickDragging.current = true;
        startY.current = e.clientY;
        setIsPulling(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRightClickDragging.current) return;
      const currentY = e.clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        setPullDistance(Math.min(diff, PULL_THRESHOLD * 1.5));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isRightClickDragging.current) {
        isRightClickDragging.current = false;
        if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
          triggerRefresh();
        } else {
          reset();
        }
      }
    };
    
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu from appearing when trying to drag
      if (isPulling) {
        e.preventDefault();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isPulling, pullDistance, isRefreshing]);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(PULL_THRESHOLD);
    
    if (onRefresh) {
      await onRefresh();
    } else {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.reload();
    }
    reset();
  };

  const reset = () => {
    setIsPulling(false);
    setIsRefreshing(false);
    setPullDistance(0);
    isRightClickDragging.current = false;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center z-50 pointer-events-none transition-transform duration-200"
        style={{
          transform: `translateY(${Math.max(pullDistance - 40, -40)}px)`,
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1)
        }}
      >
        <div className={`p-2 bg-zinc-800 rounded-full shadow-lg ${isRefreshing ? 'animate-spin' : ''}`}>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: `rotate(${isRefreshing ? 0 : pullDistance * 2}deg)` }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="transition-transform duration-200 w-full h-full"
        style={{ transform: `translateY(${isRefreshing ? PULL_THRESHOLD : pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
