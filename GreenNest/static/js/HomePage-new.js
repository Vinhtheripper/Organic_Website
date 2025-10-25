/* ==========================================
   HOMEPAGE JAVASCRIPT - MEAL PLANNER
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initMealPlannerForm();
    initCategoryTabs();
    initMealOptions();
    initCopyVoucherCode();
});

/* ==========================================
   MEAL PLANNER FORM
   ========================================== */
function initMealPlannerForm() {
    const form = document.getElementById('mealPlannerForm');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const btnNext = form.querySelector('.btn-form-next');
    const btnPrev = form.querySelector('.btn-form-prev');
    const progressFill = form.querySelector('.progress-fill');
    const progressText = form.querySelector('.progress-text');
    
    let currentStep = 1;
    const totalSteps = steps.length;

    // Next button
    if (btnNext) {
        btnNext.addEventListener('click', function() {
            if (currentStep < totalSteps) {
                // Validate current step
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateFormStep();
                }
            } else {
                // Submit form
                submitMealPlan();
            }
        });
    }

    // Previous button
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                updateFormStep();
            }
        });
    }

    function updateFormStep() {
        // Update steps visibility
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update buttons
        if (currentStep === 1) {
            btnPrev.style.display = 'none';
        } else {
            btnPrev.style.display = 'flex';
        }

        if (currentStep === totalSteps) {
            btnNext.innerHTML = '<span>Create My Plan</span><i class="lni lni-check-box"></i>';
        } else {
            btnNext.innerHTML = '<span>Continue</span><i class="lni lni-arrow-right"></i>';
        }

        // Update progress
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
    }

    function validateStep(step) {
        const currentStepEl = form.querySelector(`.form-step[data-step="${step}"]`);
        
        if (step === 1) {
            // Check if at least one meal option is selected
            const selectedMeal = currentStepEl.querySelector('.meal-option.active');
            if (!selectedMeal) {
                alert('Please select number of meals per week');
                return false;
            }
            
            // Check if at least one dietary preference is selected
            const selectedDiet = currentStepEl.querySelector('input[name="diet"]:checked');
            if (!selectedDiet) {
                alert('Please select at least one dietary preference');
                return false;
            }
        }
        
        if (step === 2) {
            // Check if goal is selected
            const selectedGoal = currentStepEl.querySelector('input[name="goal"]:checked');
            if (!selectedGoal) {
                alert('Please select your goal');
                return false;
            }
            
            // Check email
            const emailInput = currentStepEl.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value || !isValidEmail(emailInput.value)) {
                alert('Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function submitMealPlan() {
        // Collect form data
        const formData = {
            mealsPerWeek: form.querySelector('.meal-option.active')?.dataset.value,
            dietaryPreferences: Array.from(form.querySelectorAll('input[name="diet"]:checked')).map(el => el.value),
            goal: form.querySelector('input[name="goal"]:checked')?.value,
            email: form.querySelector('input[type="email"]').value
        };

        console.log('Meal Plan Data:', formData);

        // Show success message
        alert('🎉 Your meal plan is being created! Check your email for details.');
        
        // Reset form
        form.reset();
        currentStep = 1;
        updateFormStep();
        
        // Reset meal options
        form.querySelectorAll('.meal-option').forEach(opt => {
            opt.classList.remove('active');
        });
        form.querySelector('.meal-option[data-value="10"]')?.classList.add('active');
    }
}

/* ==========================================
   MEAL OPTIONS SELECTOR
   ========================================== */
function initMealOptions() {
    const mealOptions = document.querySelectorAll('.meal-option');
    
    mealOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active from all
            mealOptions.forEach(opt => opt.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
        });
    });
}

/* ==========================================
   CATEGORY TABS
   ========================================== */
function initCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    if (categoryTabs.length === 0) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Get category
            const category = this.dataset.category;
            
            // Filter products (if you want to implement filtering)
            console.log('Selected category:', category);
            // You can add product filtering logic here
        });
    });
}

/* ==========================================
   COPY VOUCHER CODE
   ========================================== */
function initCopyVoucherCode() {
    const copyButtons = document.querySelectorAll('.btn-copy-code');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.dataset.code;
            
            // Copy to clipboard
            copyToClipboard(code);
            
            // Update button state
            const originalHTML = this.innerHTML;
            this.classList.add('copied');
            this.innerHTML = '<i class="lni lni-checkmark"></i><span>Copied!</span>';
            
            // Show toast notification
            showCopyToast(code);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.classList.remove('copied');
                this.innerHTML = originalHTML;
            }, 2000);
        });
    });
}

function copyToClipboard(text) {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Code copied:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('Code copied (fallback):', text);
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyToast(code) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = `
        <i class="lni lni-checkmark-circle"></i>
        <span>Code <strong>${code}</strong> copied to clipboard!</span>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ==========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ==========================================
   INTERSECTION OBSERVER - ANIMATION ON SCROLL
   ========================================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.product-card, .value-prop-card, .benefit-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
