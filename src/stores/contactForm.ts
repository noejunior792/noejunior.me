import { atom } from 'nanostores';

export const isContactFormOpen = atom<boolean>(false);

// Initialize from localStorage on client side
if (typeof window !== 'undefined') {
  const initContactFormState = () => {
    const storedState = localStorage.getItem('contactFormOpen');
    if (storedState === 'true') {
      isContactFormOpen.set(true);
    }
  };

  // Initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactFormState);
  } else {
    initContactFormState();
  }
}

// Persist to localStorage on change
isContactFormOpen.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('contactFormOpen', String(value));
  }
});

// Helper function to toggle the contact form
export const toggleContactForm = () => {
  isContactFormOpen.set(!isContactFormOpen.get());
};

// Helper function to close the contact form
export const closeContactForm = () => {
  isContactFormOpen.set(false);
};

// Helper function to open the contact form
export const openContactForm = () => {
  isContactFormOpen.set(true);
};