const THEME_KEY = 'theme';

export function getTheme() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(THEME_KEY) || 'system';
  }
  return 'system';
}

export function applyTheme(theme) {
  if (theme === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}
