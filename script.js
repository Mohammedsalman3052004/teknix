const elevatorData = {
    optima: {
        description: "The all new OPTIMA redefines simplicity giving you vertical mobility solution with a range of technologically advanced features with German craftsmanship at its heart."
    },
    vertix: {
        description: "VERTIX combines cutting-edge vertical transportation technology with sleek design, offering premium performance and energy efficiency for modern buildings."
    },
    greentek: {
        description: "GREENTEK represents our commitment to sustainable mobility solutions, featuring eco-friendly technology and renewable energy integration."
    },
    hydratek: {
        description: "HYDRATEK delivers powerful hydraulic elevation systems with exceptional load capacity and smooth operation for low to mid-rise applications."
    },
    villamatek: {
        description: "VILLA MATEK is specially designed for residential applications, combining elegant aesthetics with compact design for luxury homes."
    }
};

// DOM elements
const elevatorItems = document.querySelectorAll('.elevator-item');
const description = document.querySelector('.elevator-description');
const elevatorImage = document.getElementById('elevatorImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const elevatorKeys = Object.keys(elevatorData);

// Update active state and content
function updateElevator(index) {
    // Remove active class from all items
    elevatorItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item
    elevatorItems[index].classList.add('active');
    
    // Update description and image
    const elevatorKey = elevatorItems[index].getAttribute('data-elevator');
    description.textContent = elevatorData[elevatorKey].description;
    
    // Change image with smooth transition
    elevatorImage.style.opacity = '0.3';
    setTimeout(() => {
        elevatorImage.className = `elevator-image ${elevatorKey}`;
        elevatorImage.style.opacity = '1';
    }, 200);
    
    currentIndex = index;
}

// Click handlers for elevator items
elevatorItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateElevator(index);
    });
});

// Arrow button handlers
prevBtn.addEventListener('click', () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : elevatorKeys.length - 1;
    updateElevator(newIndex);
});

nextBtn.addEventListener('click', () => {
    const newIndex = currentIndex < elevatorKeys.length - 1 ? currentIndex + 1 : 0;
    updateElevator(newIndex);
});





class ResponsiveNavbar {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-links');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking overlay
        this.mobileMenuOverlay.addEventListener('click', () => this.closeMobileMenu());
        
        // Close menu when clicking nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        this.mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleResize() {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
}

// Initialize the navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveNavbar();
});







class TestimonialsCarousel {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.swipeArea = document.getElementById('swipeArea');
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.isAnimating = false;
        this.autoRotateInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoRotate();
        this.updateCards();
    }

    setupEventListeners() {
        // Touch events for mobile
        let startY = 0;
        let endY = 0;
        
        this.swipeArea.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            this.stopAutoRotate();
        }, { passive: true });
        
        this.swipeArea.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startY, endY);
            this.startAutoRotate();
        }, { passive: true });

        // Mouse events for desktop
        let isMouseDown = false;
        
        this.swipeArea.addEventListener('mousedown', (e) => {
            startY = e.clientY;
            isMouseDown = true;
            this.stopAutoRotate();
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                endY = e.clientY;
                this.handleSwipe(startY, endY);
                isMouseDown = false;
                this.startAutoRotate();
            }
        });

        // Wheel event for desktop scroll
        this.swipeArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (this.isAnimating) return;
            
            this.stopAutoRotate();
            
            if (e.deltaY > 0) {
                this.nextTestimonial();
            } else {
                this.prevTestimonial();
            }
            
            this.startAutoRotate();
        }, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.prevTestimonial();
                this.stopAutoRotate();
                this.startAutoRotate();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextTestimonial();
                this.stopAutoRotate();
                this.startAutoRotate();
            }
        });

        // Pause on hover
        this.swipeArea.addEventListener('mouseenter', () => {
            this.stopAutoRotate();
        });
        
        this.swipeArea.addEventListener('mouseleave', () => {
            this.startAutoRotate();
        });
    }

    handleSwipe(startY, endY) {
        if (this.isAnimating) return;
        
        const threshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextTestimonial();
            } else {
                this.prevTestimonial();
            }
        }
    }

    nextTestimonial() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCards();
    }

    prevTestimonial() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCards();
    }

    updateCards() {
        this.isAnimating = true;

        // Update card positions with GSAP animation
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'next', 'prev', 'hidden');
            
            const isOddCard = index % 2 === 0; // 0, 2, 4 are "odd" position cards (1st, 3rd, 5th)
            const horizontalOffset = isOddCard ? -30 : 30;
            
            if (index === this.currentIndex) {
                card.classList.add('active');
                gsap.to(card, {
                    y: 0,
                    x: horizontalOffset,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
            } else if (index === (this.currentIndex + 1) % this.totalCards) {
                card.classList.add('next');
                gsap.to(card, {
                    y: 150,
                    x: horizontalOffset,
                    opacity: 0.5,
                    duration: 0.6,
                    ease: "power2.out"
                });
            } else if (index === (this.currentIndex - 1 + this.totalCards) % this.totalCards) {
                card.classList.add('prev');
                gsap.to(card, {
                    y: -150,
                    x: horizontalOffset,
                    opacity: 0.6,
                    duration: 0.6,
                    ease: "power2.out"
                });
            } else {
                card.classList.add('hidden');
                gsap.to(card, {
                    y: 300,
                    x: horizontalOffset,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        });

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            this.nextTestimonial();
        }, 4000);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});

// Add entrance animations
gsap.fromTo('.testimonials-left > *', 
    { 
        y: 30, 
        opacity: 0 
    }, 
    { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out",
        delay: 0.2
    }
);

gsap.fromTo('.testimonial-card.active', 
    { 
        x: 50, 
        opacity: 0 
    }, 
    { 
        x: -30, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power2.out",
        delay: 0.6
    }
);