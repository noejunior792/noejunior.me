// Global script for managing Astro transitions and component initialization
(function() {
  'use strict';

  // Global state management
  window.globalAppState = {
    contactForm: {
      isOpen: false,
      initialized: false
    },
    theme: {
      current: null,
      initialized: false
    },
    debug: true
  };

  // Utility functions
  function log(message) {
    if (window.globalAppState.debug) {
      console.log(`[GlobalApp] ${new Date().toLocaleTimeString()} - ${message}`);
    }
  }

  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // Theme management
  function initializeTheme() {
    return new Promise(async (resolve) => {
      try {
        const toggleButton = await waitForElement('#theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        if (!sunIcon || !moonIcon) {
          log('Theme icons not found');
          resolve(false);
          return;
        }

        // Remove existing listeners by cloning
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

        // Get current theme
        let currentTheme = window.globalAppState.theme.current || localStorage.getItem('theme');
        if (!currentTheme) {
          currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          localStorage.setItem('theme', currentTheme);
        }

        window.globalAppState.theme.current = currentTheme;

        function updateThemeUI() {
          const currentSunIcon = document.getElementById('sun-icon');
          const currentMoonIcon = document.getElementById('moon-icon');
          
          if (!currentSunIcon || !currentMoonIcon) return;
          
          if (window.globalAppState.theme.current === 'dark') {
            document.documentElement.classList.add('dark');
            currentSunIcon.classList.add('hidden');
            currentMoonIcon.classList.remove('hidden');
          } else {
            document.documentElement.classList.remove('dark');
            currentSunIcon.classList.remove('hidden');
            currentMoonIcon.classList.add('hidden');
          }
        }

        function toggleTheme() {
          window.globalAppState.theme.current = window.globalAppState.theme.current === 'dark' ? 'light' : 'dark';
          localStorage.setItem('theme', window.globalAppState.theme.current);
          updateThemeUI();
          log(`Theme toggled to: ${window.globalAppState.theme.current}`);
        }

        // Apply initial theme
        updateThemeUI();

        // Add event listener
        newToggleButton.addEventListener('click', toggleTheme);

        window.globalAppState.theme.initialized = true;
        log(`Theme initialized: ${currentTheme}`);
        resolve(true);

      } catch (error) {
        log(`Theme initialization failed: ${error.message}`);
        resolve(false);
      }
    });
  }

  // Contact form management
  function initializeContactForm() {
    return new Promise(async (resolve) => {
      try {
        const toggleButton = await waitForElement('#toggle-contact-form');
        const formWrapper = document.getElementById('contact-form-wrapper');

        if (!formWrapper) {
          log('Contact form wrapper not found');
          resolve(false);
          return;
        }

        // Remove existing listeners by cloning
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

        function updateContactFormUI() {
          const currentFormWrapper = document.getElementById('contact-form-wrapper');
          const currentToggleButton = document.getElementById('toggle-contact-form');
          
          if (!currentFormWrapper || !currentToggleButton) return;
          
          if (window.globalAppState.contactForm.isOpen) {
            currentFormWrapper.classList.remove('hidden');
            currentToggleButton.textContent = 'Fechar';
            currentToggleButton.classList.add('bg-red-500', 'hover:bg-red-600');
            currentToggleButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
          } else {
            currentFormWrapper.classList.add('hidden');
            currentToggleButton.textContent = 'Contactar';
            currentToggleButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
            currentToggleButton.classList.remove('bg-red-500', 'hover:bg-red-600');
          }
        }

        function toggleContactForm() {
          window.globalAppState.contactForm.isOpen = !window.globalAppState.contactForm.isOpen;
          updateContactFormUI();
          log(`Contact form ${window.globalAppState.contactForm.isOpen ? 'opened' : 'closed'}`);
        }

        // Add event listener
        newToggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          toggleContactForm();
        });

        // Initialize UI
        updateContactFormUI();

        // Initialize form functionality
        await initializeMessageForm();

        window.globalAppState.contactForm.initialized = true;
        log('Contact form initialized');
        resolve(true);

      } catch (error) {
        log(`Contact form initialization failed: ${error.message}`);
        resolve(false);
      }
    });
  }

  // Message form functionality
  function initializeMessageForm() {
    return new Promise((resolve) => {
      const form = document.getElementById('anonymous-message-form');
      const messageTextarea = document.getElementById('message-textarea');
      const submitButton = document.getElementById('submit-button');
      const charCount = document.getElementById('char-count');

      if (!form || !messageTextarea || !submitButton || !charCount) {
        log('Message form elements not found');
        resolve(false);
        return;
      }

      // Character counter
      function updateCharCount() {
        const count = messageTextarea.value.length;
        charCount.textContent = count.toString();
        
        if (count > 450) {
          charCount.classList.add('text-red-500');
          charCount.classList.remove('text-gray-500', 'dark:text-gray-400');
        } else {
          charCount.classList.remove('text-red-500');
          charCount.classList.add('text-gray-500', 'dark:text-gray-400');
        }
      }

      // Remove existing listeners by cloning elements
      const newForm = form.cloneNode(true);
      const newTextarea = newForm.querySelector('#message-textarea');
      const newSubmitButton = newForm.querySelector('#submit-button');
      const newCharCount = newForm.querySelector('#char-count');
      
      form.parentNode.replaceChild(newForm, form);

      // Add input listener
      newTextarea.addEventListener('input', updateCharCount);

      // Form submission
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = newTextarea.value.trim();
        
        if (!message) {
          alert('Por favor, escreva uma mensagem antes de enviar.');
          return;
        }

        if (message.length > 500) {
          alert('Mensagem muito longa. Máximo 500 caracteres.');
          return;
        }

        newSubmitButton.disabled = true;
        newSubmitButton.innerHTML = '<span class="animate-pulse">Enviando...</span>';

        try {
          const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });

          const data = await response.json();

          if (response.ok) {
            alert(data.message || 'Mensagem enviada com sucesso!');
            newTextarea.value = '';
            updateCharCount();
            
            // Close contact form
            window.globalAppState.contactForm.isOpen = false;
            const currentFormWrapper = document.getElementById('contact-form-wrapper');
            const currentToggleButton = document.getElementById('toggle-contact-form');
            if (currentFormWrapper && currentToggleButton) {
              currentFormWrapper.classList.add('hidden');
              currentToggleButton.textContent = 'Contactar';
              currentToggleButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
              currentToggleButton.classList.remove('bg-red-500', 'hover:bg-red-600');
            }
            
            log('Message sent successfully');
          } else {
            alert(data.message || 'Erro ao enviar mensagem.');
            log(`Message send failed: ${data.message}`);
          }
        } catch (error) {
          console.error('Network error:', error);
          alert('Erro de rede. Por favor, tente novamente.');
          log(`Network error: ${error.message}`);
        } finally {
          newSubmitButton.disabled = false;
          newSubmitButton.innerHTML = '<span>Enviar com carinho</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></path></svg>';
        }
      });

      // Initial character count
      updateCharCount();
      
      log('Message form initialized');
      resolve(true);
    });
  }

  // Main initialization function
  async function initializeAll() {
    log('Starting full initialization...');
    
    try {
      const [themeResult, contactFormResult] = await Promise.all([
        initializeTheme(),
        initializeContactForm()
      ]);
      
      log(`Initialization complete - Theme: ${themeResult}, ContactForm: ${contactFormResult}`);
      return themeResult && contactFormResult;
    } catch (error) {
      log(`Initialization error: ${error.message}`);
      return false;
    }
  }

  // Event listeners for Astro transitions
  function setupEventListeners() {
    // Initial load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        log('DOM loaded');
        setTimeout(initializeAll, 100);
      });
    } else {
      log('DOM already loaded');
      setTimeout(initializeAll, 100);
    }

    // Astro transitions
    document.addEventListener('astro:before-preparation', () => {
      log('Astro: Before preparation');
    });

    document.addEventListener('astro:after-preparation', () => {
      log('Astro: After preparation');
    });

    document.addEventListener('astro:before-swap', () => {
      log('Astro: Before swap');
    });

    document.addEventListener('astro:after-swap', () => {
      log('Astro: After swap - re-initializing...');
      setTimeout(initializeAll, 150);
    });

    document.addEventListener('astro:page-load', () => {
      log('Astro: Page load complete');
      setTimeout(initializeAll, 200);
    });

    // Fallback for regular navigation
    window.addEventListener('load', () => {
      log('Window load event');
      setTimeout(initializeAll, 100);
    });
  }

  // Initialize everything
  setupEventListeners();
  
  // Export functions to global scope for debugging
  window.globalApp = {
    initializeAll,
    initializeTheme,
    initializeContactForm,
    state: window.globalAppState,
    log
  };

  log('Global script loaded');
})();