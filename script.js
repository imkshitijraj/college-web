// Initialize AOS with enhanced settings
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 50,
    delay: 100,
    anchorPlacement: 'top-bottom'
});

// Add animation classes to elements on load
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        element.classList.add(animationType);
    });

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });

    // Add slide-up animation to headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        heading.classList.add('slide-up');
    });

    // Add scale-in animation to images
    const images = document.querySelectorAll('img:not(.logo)');
    images.forEach(img => {
        img.classList.add('scale-in');
        img.parentElement.classList.add('hover-zoom');
    });
});

// Enhanced Navbar scroll behavior
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.padding = '0.5rem 0';
        navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.98)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.padding = '1rem 0';
        navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
    }
});

// Add navigation highlight functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Highlight current page in navigation
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            link.style.borderRadius = '4px';
        }
    });
});

// Registration form steps
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('.registration-form');
    if (!registrationForm) return;

    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    const submitBtn = document.querySelector('.submit-registration');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
            if (indicators[index]) {
                indicators[index].classList.toggle('active', index === stepIndex);
            }
        });

        if (prevBtn) {
            prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
        }
        if (nextBtn) {
            nextBtn.textContent = stepIndex === steps.length - 1 ? 'Submit' : 'Next';
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                if (validateStep(currentStep)) {
                    currentStep++;
                    showStep(currentStep);
                }
            } else {
                if (validateStep(currentStep)) {
                    submitForm();
                }
            }
        });
    }

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                field.classList.add('is-invalid');
                showError(field, 'Please enter a valid email address');
            } else {
                field.classList.remove('is-invalid');
                removeError(field);
            }
        });

        return isValid;
    }

    function showError(field, message) {
        const errorDiv = field.nextElementSibling?.classList.contains('invalid-feedback') 
            ? field.nextElementSibling 
            : document.createElement('div');
        
        if (!field.nextElementSibling?.classList.contains('invalid-feedback')) {
            errorDiv.classList.add('invalid-feedback');
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }

    function removeError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv?.classList.contains('invalid-feedback')) {
            errorDiv.remove();
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function submitForm() {
        const formData = new FormData(registrationForm);
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            showSuccess('Thank you for registering! We will contact you soon.');
            registrationForm.reset();
            currentStep = 0;
            showStep(currentStep);
        } catch (error) {
            showError(registrationForm, error.message || 'There was an error submitting your registration. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        }
    }

    function showSuccess(message) {
        alert(message);
    }

    // Initialize first step
    showStep(currentStep);
});

// Enhanced FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;

    const accordionButtons = faqSection.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.classList.toggle('active', !isExpanded);
            
            // Find and toggle the content with animation
            const content = this.nextElementSibling;
            if (content) {
                content.style.display = 'block'; // Ensure it's visible for animation
                content.classList.toggle('active', !isExpanded);
                this.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }
        });
    });
});

// Roadmap Timeline Animation
document.addEventListener('DOMContentLoaded', function() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const timelineItems = timeline.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
});

// Committee Page Social Links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.getAttribute('href');
            if (!url || url === '#') {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    });
});

// Enhanced Sponsor Cards Animation
document.addEventListener('DOMContentLoaded', function() {
    const sponsorCards = document.querySelectorAll('.sponsor-card');
    
    sponsorCards.forEach(card => {
        // Add initial scale-in animation
        card.classList.add('scale-in');
        
        // Add hover animations (already defined in CSS)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
});

// Investment Calculator
document.addEventListener('DOMContentLoaded', function() {
    const calculator = document.querySelector('.investment-calculator');
    if (!calculator) return;

    const amountInput = calculator.querySelector('#investmentAmount');
    const termInput = calculator.querySelector('#investmentTerm');
    const rateInput = calculator.querySelector('#annualRate') || { value: '8' }; // Default 8% if not provided
    const calculateBtn = calculator.querySelector('#calculateReturn');
    const resultDiv = calculator.querySelector('#calculationResult');

    if (calculateBtn && resultDiv) {
        calculateBtn.addEventListener('click', function() {
            const amount = parseFloat(amountInput.value) || 0;
            const term = parseInt(termInput.value) || 1;
            const rate = parseFloat(rateInput.value) / 100 || 0.08;
            
            if (amount <= 0) {
                showCalculatorError('Please enter a valid investment amount');
                return;
            }

            if (term <= 0) {
                showCalculatorError('Please enter a valid investment term');
                return;
            }

            const estimatedReturn = calculateEstimatedReturn(amount, term, rate);
            
            resultDiv.innerHTML = `
                <h4>Estimated Returns</h4>
                <p>Initial Investment: $${amount.toLocaleString()}</p>
                <p>Term: ${term} years</p>
                <p>Annual Rate: ${(rate * 100).toFixed(1)}%</p>
                <p>Estimated Return: $${estimatedReturn.toLocaleString()}</p>
            `;
        });
    }

    function showCalculatorError(message) {
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
        }
    }

    function calculateEstimatedReturn(amount, term, rate) {
        return Math.round(amount * Math.pow(1 + rate, term));
    }
});

// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#name')?.value.trim();
        const email = this.querySelector('#email')?.value.trim();
        const message = this.querySelector('#message')?.value.trim();
        const submitButton = this.querySelector('button[type="submit"]');
        
        if (!name || !email || !message) {
            showContactError('Please fill in all required fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showContactError('Please enter a valid email address.');
            return;
        }
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            showContactSuccess('Thank you for your message! We will get back to you soon.');
            this.reset();
        } catch (error) {
            showContactError(error.message || 'There was an error sending your message. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
    
    function showContactError(message) {
        const errorDiv = contactForm.querySelector('.alert-danger') || document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        
        if (!contactForm.querySelector('.alert-danger')) {
            contactForm.insertBefore(errorDiv, contactForm.firstChild);
        }
    }

    function showContactSuccess(message) {
        const successDiv = contactForm.querySelector('.alert-success') || document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = message;
        
        if (!contactForm.querySelector('.alert-success')) {
            contactForm.insertBefore(successDiv, contactForm.firstChild);
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});

// Enhanced Popup handling
document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.querySelector('.popup-container');
    const popupCloseButton = document.getElementById('popup-close');
    
    if (popupContainer && popupCloseButton) {
        popupCloseButton.addEventListener('click', () => {
            popupContainer.classList.remove('show');
            setTimeout(() => {
                popupContainer.style.display = 'none';
            }, 400); // Match the transition duration
            
            sessionStorage.setItem('popupClosed', 'true');
        });

        if (!sessionStorage.getItem('popupClosed')) {
            setTimeout(() => {
                popupContainer.style.display = 'block';
                // Force reflow
                popupContainer.offsetHeight;
                popupContainer.classList.add('show');
            }, 2000);
        }
    }
});

// Add smooth scroll behavior to all anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhance form submissions with loading animations
function enhanceFormButton(button) {
    if (!button) return;
    
    const originalText = button.textContent;
    button.addEventListener('click', function() {
        if (!button.disabled) {
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="ms-2">Processing...</span>
            `;
            button.disabled = true;
        }
    });
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Apply button enhancements to all submit buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        enhanceFormButton(button);
    });
});