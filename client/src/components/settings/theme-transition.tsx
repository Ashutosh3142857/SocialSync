import React, { useEffect } from 'react';

interface ThemeTransitionProps {
  children: React.ReactNode;
}

export function ThemeTransition({ children }: ThemeTransitionProps) {
  // Add transition styles to the document on component mount
  useEffect(() => {
    // Add these CSS variables to the :root element for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --theme-transition-duration: 400ms;
      }
      
      *, *::before, *::after {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: var(--theme-transition-duration);
      }
      
      /* Elements that shouldn't have transitions */
      .no-theme-transition, 
      .no-theme-transition *, 
      .no-theme-transition *::before, 
      .no-theme-transition *::after {
        transition: none !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return <>{children}</>;
}

// This function can be called to temporarily disable transitions
// Useful when you want to switch themes without animation in certain cases
export function disableThemeTransitions(callback: () => void) {
  // Add class to disable transitions
  document.documentElement.classList.add('no-theme-transition');
  
  // Call the callback
  callback();
  
  // Force a reflow
  document.documentElement.offsetHeight;
  
  // Re-enable transitions
  setTimeout(() => {
    document.documentElement.classList.remove('no-theme-transition');
  }, 50);
}