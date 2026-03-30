// Zari Foundation | Main Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animation
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 2. Set Current Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle Icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 5. Impact Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                let currentCount = 0;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const suffix = counter.getAttribute('data-suffix') || '';
                    
                    // Calculate increment so all counters finish at about the same time
                    const inc = Math.max(target / speed, 0.1); 

                    if (currentCount < target) {
                        currentCount += inc;
                        // Avoid overshooting during animation
                        if (currentCount > target) currentCount = target;
                        counter.innerText = Math.ceil(currentCount);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                
                updateCount();
                observer.unobserve(counter); // Only run once
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, {
        root: null,
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 6. Contact Form Submission handling (Google Sheets Integration)
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    function showToast(message, type) {
        if (!toast) return;
        
        toastMsg.textContent = message;
        toast.className = 'toast show ' + type;
        
        if (type === 'success') {
            toastIcon.className = 'fa-solid fa-circle-check toast-icon';
        } else {
            toastIcon.className = 'fa-solid fa-circle-xmark toast-icon';
        }

        // Hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show sending state
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzbEFG-iizOg5tvh5iMTGfSgHZqNkPFP0el7m31Yji9Eg5CjpLbGW9acYQfHSlDHiH2/exec';
            const formData = new FormData(contactForm);
            
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    showToast('Response is saved in Google Sheet.', 'success');
                    contactForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    showToast('Oops! Something went wrong. Please try again.', 'error');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        });
    }

    // 7. Donation Modal Logic
    const donateModal = document.getElementById('donateModal');
    const donateTriggers = document.querySelectorAll('.donate-trigger');
    const closeModal = document.querySelector('.close-modal');

    const openModal = () => {
        if (donateModal) {
            donateModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    };

    const hideModal = () => {
        if (donateModal) {
            donateModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    donateTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === donateModal) {
            hideModal();
        }
    });

    // 8. Copy to Clipboard Function
    window.copyToClipboard = (elementId) => {
        const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text).then(() => {
            // Show toast for feedback
            if (typeof showToast === 'function') {
                showToast('Copied to clipboard!', 'success');
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };
});
