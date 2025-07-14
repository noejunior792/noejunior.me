import { atom } from 'nanostores';

export const theme = atom<'light' | 'dark'>('light');

// Initialize theme from localStorage or system preference
if (typeof window !== 'undefined') {
  const initTheme = () => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (storedTheme) {
      theme.set(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      theme.set(systemTheme);
      localStorage.setItem('theme', systemTheme);
    }
  };

  // Initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
}

// Persist theme changes to localStorage
theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value);
    
    // Apply theme to document
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});

// Listen for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only update if user hasn't manually set a preference
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      theme.set(e.matches ? 'dark' : 'light');
    }
  });
}