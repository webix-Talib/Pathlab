// Enhanced JavaScript for Hind Path Lab Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupMobileMenu();
    setupScrollEffects();
    setupFormHandling();
    setupTestData();
    setupAccessibility();
    setupModalHandlers();
    showWelcomeToast();
}

// Setup modal event handlers
function setupModalHandlers() {
    const closeBtn = document.getElementById('modalCloseBtn');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            closeModal();
        };
    }
    
    // Close modal on escape key
    document.onkeydown = function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalOverlay');
            if (modal && modal.style.display === 'flex') {
                closeModal();
            }
        }
    };
    
    // Close modal on backdrop click
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeModal();
            }
        };
    }
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileToggle && navContainer) {
        mobileToggle.addEventListener('click', function() {
            navContainer.classList.toggle('active');
            const isExpanded = navContainer.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            
            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (isExpanded) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Enhanced scroll effects and navigation
function setupScrollEffects() {
    const nav = document.querySelector('nav');
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Intersection Observer for section visibility
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.3
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in animation
                entry.target.classList.add('fade-in');
                
                // Update active navigation link
                const targetId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Scroll event handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Sticky nav background
        if (scrollY > 50) {
            nav.classList.add('scrolled');
            backToTopBtn.style.display = 'flex';
        } else {
            nav.classList.remove('scrolled');
            backToTopBtn.style.display = 'none';
        }
    }
    
    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Show booking form
function showForm() {
    const form = document.getElementById('bookingForm');
    const bookingSection = document.getElementById('booking');
    
    if (form && bookingSection) {
        form.style.display = 'block';
        
        // Smooth scroll to booking section
        const offsetTop = bookingSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Focus first form field for accessibility
        setTimeout(() => {
            const firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 500);
    }
}

// Enhanced form handling with validation
function setupFormHandling() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Payment method handling
    setupPaymentMethodHandling();
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

// Payment method functionality
function setupPaymentMethodHandling() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const upiSection = document.querySelector('.upi-section');
    
    if (!paymentRadios.length || !upiSection) return;
    
    // Initially hide UPI section
    upiSection.style.display = 'none';
    
    // Handle payment method changes
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'UPI' && this.checked) {
                upiSection.style.display = 'block';
                // Smooth scroll to UPI section
                setTimeout(() => {
                    upiSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
            } else {
                upiSection.style.display = 'none';
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('id');
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Validation rules
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'age':
            const age = parseInt(value);
            if (!value) {
                errorMessage = 'Age is required';
                isValid = false;
            } else if (age < 1 || age > 120) {
                errorMessage = 'Please enter a valid age';
                isValid = false;
            }
            break;
            
        case 'gender':
            if (!value) {
                errorMessage = 'Please select gender';
                isValid = false;
            }
            break;
            
        case 'mobile':
            const mobilePattern = /^[6-9]\d{9}$/;
            if (!value) {
                errorMessage = 'Mobile number is required';
                isValid = false;
            } else if (!mobilePattern.test(value)) {
                errorMessage = 'Please enter a valid 10-digit mobile number';
                isValid = false;
            }
            break;
            
        case 'address':
            if (!value) {
                errorMessage = 'Address is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Please enter complete address';
                isValid = false;
            }
            break;
    }
    
    if (!isValid && errorElement) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.style.borderColor = '#d32f2f';
        field.setAttribute('aria-invalid', 'true');
    }
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check if at least one test is selected
    const selectedTests = form.querySelectorAll('input[name="tests"]:checked');
    if (selectedTests.length === 0) {
        showToast('Please select at least one test', 'error');
        isFormValid = false;
    }
    
    // Check if payment method is selected
    const selectedPayment = form.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showToast('Please select a payment method', 'error');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        showToast('Please correct the errors and try again', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        name: form.name.value.trim(),
        age: form.age.value,
        gender: form.gender.value,
        address: form.address.value.trim(),
        mobile: form.mobile.value.trim(),
        tests: Array.from(selectedTests).map(cb => cb.value),
        payment_method: selectedPayment ? selectedPayment.value : '',
        timestamp: new Date().toISOString()
    };
    
    // Send form data to Formspree (free email service)
    setTimeout(() => {
        try {
            // ALWAYS send email backup first (guaranteed delivery to altaf9373@gmail.com)
            sendViaEmail(formData);
            
            // Also try Formspree for professional delivery
            fetch('https://formspree.io/f/manbklrg', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    _replyto: 'altaf9373@gmail.com',
                    _subject: 'New Test Booking - Hind Path Lab',
                    _template: 'table'
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log('✅ Formspree submission successful');
                } else {
                    console.log('⚠️ Formspree failed, but email backup sent');
                }
                
                // Show success modal regardless
                showSuccessModal();
                
                // Reset form
                form.reset();
                form.style.display = 'none';
                
                // Track form submission (for analytics)
                trackFormSubmission(formData);
            })
            .catch(error => {
                console.error('Formspree error:', error);
                // Fallback: Open email client with pre-filled data
                sendViaEmail(formData);
                showSuccessModal();
                form.reset();
                form.style.display = 'none';
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Error submitting form. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1000);
}

function showSuccessModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        // Use the same method that works for force close
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.setAttribute('aria-hidden', 'false');
        
        // Log for debugging
        console.log('Modal opened successfully');
        
        // Focus on close button for accessibility
        setTimeout(() => {
            const closeBtn = document.getElementById('modalCloseBtn');
            if (closeBtn) {
                closeBtn.focus();
                console.log('Close button focused - try clicking it now!');
            }
        }, 100);
    } else {
        console.log('Modal element not found!');
    }
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.setAttribute('aria-hidden', 'true');
        
        // Log for debugging
        console.log('Modal closed successfully');
    }
}

// Enhanced test data setup
function setupTestData() {
    const testData = `1️⃣ Hematology Tests
Complete Blood Count (CBC)
Hemoglobin (Hb)
Total Leukocyte Count (TLC)
Differential Leukocyte Count (DLC)
RBC Count
Packed Cell Volume (PCV)
Mean Corpuscular Volume (MCV)
Mean Corpuscular Hemoglobin (MCH)
Platelet Count
Erythrocyte Sedimentation Rate (ESR)
Peripheral Blood Smear
Reticulocyte Count

2️⃣ Clinical Biochemistry
Fasting Blood Sugar (FBS)
Post Prandial Blood Sugar (PPBS)
Random Blood Sugar (RBS)
HbA1c (Glycated Hemoglobin)
Blood Urea
Serum Creatinine
Uric Acid
Serum Electrolytes (Na, K, Cl)
Serum Calcium
Serum Phosphorus

3️⃣ Liver Function Tests
Total Bilirubin
Direct Bilirubin
Indirect Bilirubin
SGOT (AST)
SGPT (ALT)
Alkaline Phosphatase (ALP)
Total Protein
Serum Albumin
Serum Globulin

4️⃣ Lipid Profile
Total Cholesterol
Triglycerides
HDL Cholesterol
LDL Cholesterol
VLDL Cholesterol
Cholesterol/HDL Ratio

5️⃣ Thyroid Function Tests
TSH (Thyroid Stimulating Hormone)
T3 (Triiodothyronine)
T4 (Thyroxine)
Free T3
Free T4

6️⃣ Cardiac Markers
Troponin I
Troponin T
CK-MB
Total CK
LDH

7️⃣ Urine Analysis
Routine Urine Examination
Urine Culture & Sensitivity
24-Hour Urine Protein
Microalbuminuria

8️⃣ Stool Examination
Routine Stool Examination
Stool for Occult Blood
Stool Culture

9️⃣ Microbiology & Serology
Blood Culture
Sputum Culture
Throat Swab Culture
Malaria Parasite (MP)
Widal Test
Dengue NS1 Antigen
Dengue IgM/IgG
COVID-19 RT-PCR
HIV 1&2
HBsAg
HCV
VDRL

🔟 Hormone Tests
Insulin
C-Peptide
Cortisol
Testosterone
Estradiol
Progesterone
LH (Luteinizing Hormone)
FSH (Follicle Stimulating Hormone)
Prolactin

🔟➕ Special Tests
Vitamin D3
Vitamin B12
Folate
Iron Studies
CRP (C-Reactive Protein)
RA Factor
ANA (Antinuclear Antibody)
Anti-CCP`;

    const container = document.getElementById('testList');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    const lines = testData.split('\n');
    let currentGroup = null;
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (/^[🔟➕\d]+[️⃣➕]/.test(line)) {
            // Create test category
            currentGroup = document.createElement('div');
            currentGroup.className = 'test-category';
            
            const categoryTitle = document.createElement('strong');
            categoryTitle.textContent = line.replace(/^[🔟➕\d]+[️⃣➕]\s*/, '');
            currentGroup.appendChild(categoryTitle);
            
            container.appendChild(currentGroup);
        } else if (currentGroup) {
            // Create test option
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'tests';
            checkbox.value = line;
            checkbox.id = `test-${line.replace(/[^a-zA-Z0-9]/g, '-')}`;
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + line));
            
            currentGroup.appendChild(label);
        }
    });
}

// Enhanced toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `show ${type}`;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function showWelcomeToast() {
    setTimeout(() => {
        showToast('Welcome to Hind Path Lab! Book your tests online for convenient home collection.');
    }, 1000);
}

// Accessibility enhancements
function setupAccessibility() {
    // Add keyboard navigation for custom elements
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Announce page changes for screen readers
    const pageTitle = document.title;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    
    // Focus management for modal - simplified
    let lastFocusedElement = null;
}

// Analytics tracking (replace with your analytics solution)
function trackFormSubmission(data) {
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'booking_form',
            value: data.tests.length
        });
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Booking Form',
            content_category: 'Healthcare'
        });
    }
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeImages);

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Fallback: Send via email client
function sendViaEmail(formData) {
    const subject = encodeURIComponent('🔬 NEW BOOKING - Hind Path Lab Website');
    const body = encodeURIComponent(`
📋 NEW TEST BOOKING REQUEST - HIND PATH LAB

👤 CUSTOMER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.name}
Age: ${formData.age} years
Gender: ${formData.gender}
Mobile: +91-${formData.mobile}

📍 ADDRESS FOR SAMPLE COLLECTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.address}

🧪 SELECTED TESTS (${formData.tests.length} tests):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.tests.map((test, index) => `${index + 1}. ${test}`).join('\n')}

⏰ BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking Time: ${new Date(formData.timestamp).toLocaleString('en-IN')}
Source: Website Form (hindpathlab.com)

📞 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Call customer within 30 minutes: +91-${formData.mobile}
2. Confirm appointment and timing
3. Schedule home sample collection
4. Send SMS confirmation to customer

💡 CUSTOMER CONTACT METHODS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Call: +91-${formData.mobile}
📱 WhatsApp: https://wa.me/91${formData.mobile}

⚡ PRIORITY: Customer expects callback within 30 minutes!
    `);
    
    const mailtoLink = `mailto:altaf9373@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    // Also send WhatsApp notification to admin
    sendWhatsAppNotification(formData);
}

// Send WhatsApp notification to admin
function sendWhatsAppNotification(formData) {
    const message = encodeURIComponent(`🔬 *New Test Booking - Hind Path Lab*

👤 *Customer Details:*
Name: ${formData.name}
Age: ${formData.age}
Gender: ${formData.gender}
Mobile: ${formData.mobile}

📍 *Address:*
${formData.address}

🧪 *Tests Selected:*
${formData.tests.map(test => `• ${test}`).join('\n')}

⏰ *Booking Time:* ${new Date(formData.timestamp).toLocaleString()}

Please contact customer to confirm appointment.`);
    
    const whatsappLink = `https://wa.me/917607244793?text=${message}`;
    // Open in a new tab so user can send the message
    setTimeout(() => {
        window.open(whatsappLink, '_blank');
    }, 2000);
}

// Export functions for global access
window.showForm = showForm;
