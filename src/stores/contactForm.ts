import { atom } from 'nanostores';

export const isContactFormOpen = atom(false);

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const storedState = localStorage.getItem('contactFormOpen');
  if (storedState === 'true') {
    isContactFormOpen.set(true);
  }
}

// Persist to localStorage on change
isContactFormOpen.listen(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('contactFormOpen', String(value));
  }
});
