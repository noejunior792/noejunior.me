import { atom } from 'nanostores';

export const theme = atom<'light' | 'dark'>('light');

let isUserManuallySet = false;

// Initialize theme from localStorage or system preference
if (typeof window !== 'undefined') {
  const initTheme = () => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userSetFlag = localStorage.getItem('theme-user-set') === 'true';
    
    if (storedTheme) {
      theme.set(storedTheme);
      isUserManuallySet = userSetFlag;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      theme.set(systemTheme);
      // Don't save to localStorage initially - let user choose first
    }
  };

  // Initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
}

// Export function to manually set theme (called by toggle button)
export const setTheme = (newTheme: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    isUserManuallySet = true;
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('theme-user-set', 'true');
    theme.set(newTheme);
  }
};

// Persist theme changes to localStorage only when manually set
theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    // Apply theme to document
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Only save if it was manually set
    if (isUserManuallySet) {
      localStorage.setItem('theme', value);
    }
  }
});

// Listen for system theme changes only if user hasn't manually set preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only update if user hasn't manually set a preference
    const userSetFlag = localStorage.getItem('theme-user-set') === 'true';
    if (!userSetFlag && !isUserManuallySet) {
      theme.set(e.matches ? 'dark' : 'light');
    }
  });
}