// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Navbar scroll behavior
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.98)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
    }
});

// Registration form steps
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('.registration-form');
    if (registrationForm) {
        const steps = document.querySelectorAll('.form-step');
        const indicators = document.querySelectorAll('.step-indicator');
        const prevBtn = document.querySelector('.prev-step');
        const nextBtn = document.querySelector('.next-step');
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
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            return isValid;
        }

        function submitForm() {
            // Add your form submission logic here
            console.log('Form submitted');
            alert('Thank you for registering! We will contact you soon.');
        }

        // Initialize first step
        showStep(currentStep);
    }
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqSection = document.querySelector('.faq-section');
    if (faqSection) {
        const accordionButtons = faqSection.querySelectorAll('.accordion-button');
        
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.classList.toggle('active', !isExpanded);
            });
        });
    }
});

// Roadmap Timeline Animation
document.addEventListener('DOMContentLoaded', function() {
    const timeline = document.querySelector('.timeline');
    if (timeline) {
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
    }
});

// Committee Page Social Links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
});

// Sponsor Cards Animation
document.addEventListener('DOMContentLoaded', function() {
    const sponsorCards = document.querySelectorAll('.sponsor-card');
    
    sponsorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Investment Calculator (for Investors page)
document.addEventListener('DOMContentLoaded', function() {
    const calculator = document.querySelector('.investment-calculator');
    if (calculator) {
        const amountInput = calculator.querySelector('#investmentAmount');
        const termInput = calculator.querySelector('#investmentTerm');
        const calculateBtn = calculator.querySelector('#calculateReturn');
        const resultDiv = calculator.querySelector('#calculationResult');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                const amount = parseFloat(amountInput.value) || 0;
                const term = parseInt(termInput.value) || 1;
                const estimatedReturn = calculateEstimatedReturn(amount, term);
                
                resultDiv.innerHTML = `
                    <h4>Estimated Returns</h4>
                    <p>Initial Investment: $${amount.toLocaleString()}</p>
                    <p>Term: ${term} years</p>
                    <p>Estimated Return: $${estimatedReturn.toLocaleString()}</p>
                `;
            });
        }

        function calculateEstimatedReturn(amount, term) {
            // Simple calculation (can be modified based on actual investment terms)
            const annualRate = 0.08; // 8% annual return
            return Math.round(amount * Math.pow(1 + annualRate, term));
        }
    }
});

// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
        
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.querySelector('.popup-container');
    const popupCloseButton = document.getElementById('popup-close');

    // Show the popup on page load
    popupContainer.style.display = 'block';

    // Hide the popup when the close button is clicked
    popupCloseButton.addEventListener('click', function() {
        popupContainer.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.querySelector('.popup-container');

    setTimeout(() => {
        popupContainer.style.display = 'block';
    }, 2000); // Display after 2 seconds
});

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});