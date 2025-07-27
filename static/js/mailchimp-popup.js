/**
 * Mailchimp Popup Handler
 * Handles popup display logic, user interactions, and form submissions
 */
class MailchimpPopup {
  constructor(options = {}) {
    this.options = {
      // Default configuration
      showDelay: 30000, // Show after 30 seconds
      exitIntentEnabled: true,
      scrollPercentage: 70, // Show after scrolling 70%
      cookieExpiry: 30, // Remember user choice for 30 days
      maxDisplays: 3, // Maximum times to show popup
      ...options
    };
    
    this.popup = null;
    this.isShown = false;
    this.isSubmitting = false;
    this.exitIntentShown = false;
    
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.popup = document.getElementById('mailchimp-popup');
    if (!this.popup) return;
    
    // Check if user has already interacted with popup
    if (this.shouldShowPopup()) {
      this.bindEvents();
      this.startTimers();
    }
  }
  
  shouldShowPopup() {
    // Check if user has dismissed popup or subscribed
    const dismissed = localStorage.getItem('mailchimp-popup-dismissed');
    const subscribed = localStorage.getItem('mailchimp-popup-subscribed');
    const displayCount = parseInt(localStorage.getItem('mailchimp-popup-count') || '0');
    
    if (subscribed || dismissed) {
      const dismissedDate = new Date(dismissed || 0);
      const now = new Date();
      const daysSinceDismissal = (now - dismissedDate) / (1000 * 60 * 60 * 24);
      
      // Don't show if dismissed recently or subscribed
      if (subscribed || daysSinceDismissal < this.options.cookieExpiry) {
        return false;
      }
    }
    
    // Don't show if displayed too many times
    return displayCount < this.options.maxDisplays;
  }
  
  bindEvents() {
    // Close button
    const closeBtn = this.popup.querySelector('.mailchimp-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hidePopup());
    }
    
    // No thanks button
    const noThanksBtn = this.popup.querySelector('.mailchimp-popup-no-thanks');
    if (noThanksBtn) {
      noThanksBtn.addEventListener('click', () => this.dismissPopup());
    }
    
    // Form submission
    const form = this.popup.querySelector('.mailchimp-popup-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Click outside to close
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.hidePopup();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isShown) {
        this.hidePopup();
      }
    });
    
    // Exit intent detection
    if (this.options.exitIntentEnabled) {
      document.addEventListener('mouseleave', (e) => this.handleExitIntent(e));
    }
    
    // Scroll detection
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  startTimers() {
    // Show after delay
    setTimeout(() => {
      if (!this.isShown && this.shouldShowPopup()) {
        this.showPopup('timer');
      }
    }, this.options.showDelay);
  }
  
  handleExitIntent(e) {
    if (this.exitIntentShown || this.isShown) return;
    
    // Detect if mouse is leaving the viewport at the top
    if (e.clientY <= 0 && e.relatedTarget === null) {
      this.exitIntentShown = true;
      this.showPopup('exit-intent');
    }
  }
  
  handleScroll() {
    if (this.isShown) return;
    
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercentage >= this.options.scrollPercentage) {
      this.showPopup('scroll');
    }
  }
  
  showPopup(trigger = 'manual') {
    if (this.isShown || !this.shouldShowPopup()) return;
    
    this.isShown = true;
    
    // Update display count
    const currentCount = parseInt(localStorage.getItem('mailchimp-popup-count') || '0');
    localStorage.setItem('mailchimp-popup-count', (currentCount + 1).toString());
    
    // Show popup with animation
    this.popup.classList.add('show', 'animate-in');
    this.popup.setAttribute('aria-hidden', 'false');
    
    // Focus trap
    this.trapFocus();
    
    // Analytics tracking (if available)
    this.trackEvent('popup_shown', { trigger });
    
    // Auto-hide after 60 seconds of inactivity
    this.autoHideTimer = setTimeout(() => {
      if (this.isShown) {
        this.hidePopup();
      }
    }, 60000);
  }
  
  hidePopup() {
    if (!this.isShown) return;
    
    this.isShown = false;
    this.popup.classList.remove('show', 'animate-in');
    this.popup.setAttribute('aria-hidden', 'true');
    
    // Clear auto-hide timer
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    
    // Return focus to previous element
    this.releaseFocus();
    
    this.trackEvent('popup_closed');
  }
  
  dismissPopup() {
    // Mark as dismissed
    localStorage.setItem('mailchimp-popup-dismissed', new Date().toISOString());
    this.hidePopup();
    this.trackEvent('popup_dismissed');
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    const form = e.target;
    const emailInput = form.querySelector('input[name="EMAIL"]');
    const submitBtn = form.querySelector('.mailchimp-popup-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    if (!emailInput.value || !emailInput.validity.valid) {
      this.showError('Please enter a valid email address.');
      emailInput.focus();
      return;
    }
    
    this.isSubmitting = true;
    
    // Update UI
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'block';
    
    try {
      // Submit form to Mailchimp
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Mailchimp doesn't support CORS
      });
      
      // Since we can't read the response with no-cors, assume success
      this.showSuccess();
      localStorage.setItem('mailchimp-popup-subscribed', new Date().toISOString());
      this.trackEvent('newsletter_signup', { email: emailInput.value });
      
    } catch (error) {
      console.error('Subscription error:', error);
      this.showError('Something went wrong. Please try again.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitText.style.display = 'block';
      submitLoading.style.display = 'none';
    }
  }
  
  showSuccess() {
    const content = this.popup.querySelector('.mailchimp-popup-content');
    content.innerHTML = `
      <div class="mailchimp-popup-success">
        <div class="success-icon">✓</div>
        <h3>Thanks for subscribing!</h3>
        <p>You'll receive our latest insights on technology, cybersecurity, and business growth.</p>
      </div>
    `;
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      this.hidePopup();
    }, 3000);
  }
  
  showError(message) {
    // Create or update error message
    let errorDiv = this.popup.querySelector('.mailchimp-popup-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'mailchimp-popup-error';
      errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        border: 1px solid #ffcdd2;
      `;
      
      const form = this.popup.querySelector('.mailchimp-popup-form');
      form.parentNode.insertBefore(errorDiv, form);
    }
    
    errorDiv.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
  
  trapFocus() {
    const focusableElements = this.popup.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store currently focused element
    this.previouslyFocused = document.activeElement;
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }
    
    // Handle tab cycling
    this.focusHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', this.focusHandler);
  }
  
  releaseFocus() {
    if (this.focusHandler) {
      document.removeEventListener('keydown', this.focusHandler);
    }
    
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }
  
  trackEvent(eventName, data = {}) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Mailchimp Popup',
        ...data
      });
    }
    
    // Custom analytics tracking
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track(eventName, data);
    }
    
    // Console logging for debugging
    console.log('Mailchimp Popup Event:', eventName, data);
  }
  
  // Public methods
  show() {
    this.showPopup('manual');
  }
  
  hide() {
    this.hidePopup();
  }
  
  reset() {
    localStorage.removeItem('mailchimp-popup-dismissed');
    localStorage.removeItem('mailchimp-popup-subscribed');
    localStorage.removeItem('mailchimp-popup-count');
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if popup element exists and Mailchimp is configured
  const popupElement = document.getElementById('mailchimp-popup');
  const mailchimpConfig = window.mailchimpConfig || {};
  
  if (popupElement && mailchimpConfig.enabled !== false) {
    window.mailchimpPopup = new MailchimpPopup(mailchimpConfig);
  }
});

// Expose class globally for manual initialization
window.MailchimpPopup = MailchimpPopup;