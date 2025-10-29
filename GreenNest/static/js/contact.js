/* ==========================================
   CONTACT PAGE - FORM HANDLING
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    // Form Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            captcha: document.getElementById('captcha').checked
        };

        // Validate captcha
        if (!formData.captcha) {
            showError('Please verify that you are not a robot');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="lni lni-spinner-arrow"></i>';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with your actual endpoint)
            await sendContactForm(formData);
            
            // Show success message
            showSuccess();
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending form:', error);
            showError('Something went wrong. Please try again.');
            
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Simulate API call
    function sendContactForm(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In production, replace with actual API call
                console.log('Form data:', data);
                
                // Simulate success (90% chance)
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    // Show success message
    function showSuccess() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Show error message
    function showError(message) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        
        if (message) {
            errorMessage.querySelector('p').textContent = message;
        }
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Input validation animations
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('invalid');
            
            setTimeout(() => {
                input.classList.remove('invalid');
            }, 300);
        });
        
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.classList.remove('invalid');
            }
        });
    });
});

// Add invalid animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .form-input.invalid,
    .form-textarea.invalid {
        animation: shake 0.3s ease;
        border-color: #DC3545 !important;
    }
`;
document.head.appendChild(style);