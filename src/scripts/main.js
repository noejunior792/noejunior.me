import { theme } from '../stores/theme';
import { isContactFormOpen } from '../stores/contactForm';

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
  localStorage.setItem('theme', currentTheme);
}

function initializeContactForm() {
  const toggleButton = document.getElementById('toggle-contact-form');
  const formWrapper = document.getElementById('contact-form-wrapper');

  if (toggleButton && formWrapper) {
    // Function to update UI based on contact form state
    function updateContactFormUI(isOpen) {
      if (isOpen) {
        formWrapper.classList.remove('hidden');
        toggleButton.textContent = 'Fechar';
        toggleButton.classList.add('bg-red-500', 'hover:bg-red-600');
        toggleButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
      } else {
        formWrapper.classList.add('hidden');
        toggleButton.textContent = 'Contactar';
        toggleButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
        toggleButton.classList.remove('bg-red-500', 'hover:bg-red-600');
      }
    }

    // Subscribe to contact form state changes
    isContactFormOpen.subscribe(updateContactFormUI);

    // Handle button click
    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      const currentState = isContactFormOpen.get();
      isContactFormOpen.set(!currentState);
    });

    // Set initial state
    updateContactFormUI(isContactFormOpen.get());
  }
}

function initializeAnonymousMessageForm() {
  const form = document.getElementById('anonymous-message-form');
  const messageTextarea = document.getElementById('message-textarea');
  const submitButton = document.getElementById('submit-button');

  if (!form || !messageTextarea || !submitButton) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = messageTextarea.value.trim();

    if (!message) {
      // Use native alert if toast is not available
      if (typeof toast !== 'undefined') {
        toast.error('Por favor, escreva uma mensagem antes de enviar.');
      } else {
        alert('Por favor, escreva uma mensagem antes de enviar.');
      }
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="animate-pulse">Enviando...</span>';

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
        if (typeof toast !== 'undefined') {
          toast.success(data.message || 'Mensagem enviada com sucesso!');
        } else {
          alert(data.message || 'Mensagem enviada com sucesso!');
        }
        messageTextarea.value = ''; // Clear the textarea
        // Close the contact form after successful submission
        isContactFormOpen.set(false);
      } else {
        if (typeof toast !== 'undefined') {
          toast.error(data.message || 'Erro ao enviar mensagem.');
        } else {
          alert(data.message || 'Erro ao enviar mensagem.');
        }
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      if (typeof toast !== 'undefined') {
        toast.error('Erro de rede. Por favor, tente novamente.');
      } else {
        alert('Erro de rede. Por favor, tente novamente.');
      }
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>Enviar com carinho</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>';
    }
  });
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeContactForm();
  initializeAnonymousMessageForm();
});

// Subscribe to theme changes
theme.subscribe(applyTheme);

// Re-initialize on Astro page swap
document.addEventListener('astro:after-swap', () => {
  initializeTheme();
  initializeContactForm();
  initializeAnonymousMessageForm();
});