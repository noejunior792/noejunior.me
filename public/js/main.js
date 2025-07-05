import { theme } from '../src/stores/theme';
import { isContactFormOpen } from '../src/stores/contactForm';

function initializeTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    theme.set(storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.set('dark');
  } else {
    theme.set('light');
  }
}

function applyTheme(currentTheme) {
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function initializeContactForm() {
  const toggleButton = document.getElementById('toggle-contact-form');
  const formWrapper = document.getElementById('contact-form-wrapper');

  if (toggleButton && formWrapper) {
    isContactFormOpen.subscribe(isOpen => {
      if (isOpen) {
        formWrapper.classList.remove('hidden');
      } else {
        formWrapper.classList.add('hidden');
      }
    });

    toggleButton.addEventListener('click', () => {
      isContactFormOpen.set(!isContactFormOpen.get());
    });

    // Set initial state based on store
    if (isContactFormOpen.get()) {
      formWrapper.classList.remove('hidden');
    } else {
      formWrapper.classList.add('hidden');
    }
  }
}

// Run on initial load
initializeTheme();
initializeContactForm();

// Subscribe to theme changes
theme.subscribe(applyTheme);

// Re-initialize on Astro page swap
document.addEventListener('astro:after-swap', () => {
  initializeTheme();
  initializeContactForm();
});
