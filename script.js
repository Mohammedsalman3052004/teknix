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

        // Wheel event for desktop scroll - only prevent default when over cards
        this.swipeArea.addEventListener('wheel', (e) => {
            // Check if mouse is directly over a testimonial card
            const target = e.target.closest('.testimonial-card');
            if (target) {
                e.preventDefault();
                if (this.isAnimating) return;
                
                this.stopAutoRotate();
                
                if (e.deltaY > 0) {
                    this.nextTestimonial();
                } else {
                    this.prevTestimonial();
                }
                
                this.startAutoRotate();
            }
            // If not over a card, allow normal page scrolling
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





let modalShown = false;
        let autoShowTimer;

        // Auto-show modal after 5 seconds
        function autoShowModal() {
            autoShowTimer = setTimeout(() => {
                if (!modalShown) {
                    openModal();
                }
            }, 5000);
        }

        // Open modal function
        function openModal() {
            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            modalShown = true;
            
            // Clear the auto-show timer if modal is opened manually
            if (autoShowTimer) {
                clearTimeout(autoShowTimer);
            }
        }

        // Close modal function
        function closeModal() {
            const overlay = document.getElementById('modalOverlay');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking outside
        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Form submission
        function submitForm(event) {
            event.preventDefault();
            
            // Show success message
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            
            // Reset form
            const form = document.getElementById('contactForm');
            form.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
            
            // Close modal after 4 seconds
            setTimeout(() => {
                closeModal();
            }, 4000);
        }

        // Prevent modal from auto-showing if user has already interacted
        document.addEventListener('DOMContentLoaded', function() {
            // Check if user has previously seen the modal (using localStorage)
            const hasSeenModal = localStorage.getItem('teknixModalSeen');
            
            if (!hasSeenModal) {
                autoShowModal();
            }
        });

        // Store that user has seen the modal
        function markModalAsSeen() {
            localStorage.setItem('teknixModalSeen', 'true');
        }

        // Add event listeners to download buttons
        document.addEventListener('DOMContentLoaded', function() {
            const downloadBtns = document.querySelectorAll('.download-btn');
            downloadBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    openModal();
                    markModalAsSeen();
                });
            });
        });

        // Smooth scrolling for mobile
        function preventScrollChaining(e) {
            const container = document.getElementById('modalContainer');
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const height = container.clientHeight;
            const wheelDelta = e.deltaY;
            const isDeltaPositive = wheelDelta > 0;

            if (isDeltaPositive && scrollTop + height >= scrollHeight) {
                e.preventDefault();
            } else if (!isDeltaPositive && scrollTop <= 0) {
                e.preventDefault();
            }
        }

        // Add touch and wheel event listeners for better mobile experience
        document.addEventListener('DOMContentLoaded', function() {
            const modalContainer = document.getElementById('modalContainer');
            modalContainer.addEventListener('wheel', preventScrollChaining, { passive: false });
        });

        // Auto-hide modal on mobile after form submission
        if (window.innerWidth <= 768) {
            const originalSubmitForm = submitForm;
            submitForm = function(event) {
                originalSubmitForm(event);
                setTimeout(() => {
                    closeModal();
                }, 2000); // Close sooner on mobile
            };
        }






// ==================================================
// FIREBASE CLOUD STORAGE - COMPLETE SOLUTION
// ==================================================

// Firebase configuration (using your provided config)
const firebaseConfig = {
    apiKey: "AIzaSyARxBMyoWgBO5EPJVmNbtv_YzCVvsWrVzc",
    authDomain: "peknix.firebaseapp.com",
    projectId: "peknix",
    storageBucket: "peknix.firebasestorage.app",
    messagingSenderId: "765710336493",
    appId: "1:765710336493:web:2e98190d75fca3922aa7e4",
    measurementId: "G-ZT50HR07KV"
};

// Initialize Firebase
let db;
let isFirebaseInitialized = false;

async function initializeFirebase() {
    try {
        // Import Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js');
        const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } = await import('https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js');
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
        // Store Firebase functions globally for use
        window.firebaseHelpers = {
            collection,
            addDoc,
            getDocs,
            deleteDoc,
            doc,
            orderBy,
            query
        };
        
        isFirebaseInitialized = true;
        console.log('Firebase initialized successfully');
        
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        alert('Error connecting to cloud storage. Please try again later.');
    }
}

// ==================================================
// FORM SUBMISSION FUNCTION
// ==================================================

async function submitForm(event) {
    event.preventDefault();
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Initialize Firebase if not already done
        if (!isFirebaseInitialized) {
            await initializeFirebase();
        }
        
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add metadata
        data.timestamp = new Date().toISOString();
        data.id = Date.now().toString();
        data.submissionDate = new Date().toLocaleDateString();
        data.submissionTime = new Date().toLocaleTimeString();
        
        // Validate required fields
        const requiredFields = ['name', 'phone', 'email', 'floors', 'construction', 'location', 'budget', 'plan'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }
        
        // Save to Firestore
        const { collection, addDoc } = window.firebaseHelpers;
        const docRef = await addDoc(collection(db, "form-submissions"), data);
        
        console.log("Document written with ID: ", docRef.id);
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Reset form
        event.target.reset();
        
        // Hide modal after 2 seconds
        setTimeout(() => {
            closeModal();
            successMessage.classList.remove('show');
        }, 2000);
        
        console.log('Form submitted successfully:', data);
        
    } catch (error) {
        console.error("Error submitting form: ", error);
        alert('There was an error submitting the form: ' + error.message);
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ==================================================
// ADMIN FUNCTIONS FOR VIEWING DATA
// ==================================================

async function viewAllSubmissions() {
    try {
        if (!isFirebaseInitialized) {
            await initializeFirebase();
        }
        
        const { collection, getDocs, query, orderBy } = window.firebaseHelpers;
        const q = query(collection(db, "form-submissions"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const submissions = [];
        querySnapshot.forEach((doc) => {
            submissions.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        
        console.table(submissions);
        return submissions;
        
    } catch (error) {
        console.error('Error fetching submissions:', error);
        alert('Error fetching data from cloud storage');
        return [];
    }
}

// ==================================================
// EXPORT TO CSV FUNCTION
// ==================================================

async function exportToCSV() {
    try {
        const submissions = await viewAllSubmissions();
        
        if (submissions.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Define headers in desired order
        const headers = [
            'timestamp',
            'submissionDate', 
            'submissionTime',
            'name',
            'phone',
            'email',
            'floors',
            'construction',
            'location',
            'budget',
            'plan',
            'message'
        ];
        
        const csvContent = [
            headers.join(','),
            ...submissions.map(row => 
                headers.map(field => `"${(row[field] || '').toString().replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teknix-form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        console.log('CSV export completed');
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Error exporting data');
    }
}

// ==================================================
// DELETE SUBMISSION FUNCTION
// ==================================================

async function deleteSubmission(firebaseId) {
    try {
        if (!confirm('Are you sure you want to delete this submission?')) {
            return;
        }
        
        if (!isFirebaseInitialized) {
            await initializeFirebase();
        }
        
        const { doc, deleteDoc } = window.firebaseHelpers;
        await deleteDoc(doc(db, "form-submissions", firebaseId));
        
        console.log('Submission deleted successfully');
        alert('Submission deleted successfully');
        
        // Refresh the admin panel if it's open
        if (document.querySelector('.admin-modal')) {
            showAdminPanel();
        }
        
    } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Error deleting submission');
    }
}

// ==================================================
// MODAL FUNCTIONS
// ==================================================

function openModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('contactForm');
    if (form) form.reset();
    
    // Hide success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) successMessage.classList.remove('show');
}

// ==================================================
// ADMIN PANEL
// ==================================================

async function showAdminPanel() {
    try {
        const submissions = await viewAllSubmissions();
        
        // Remove existing admin modal
        const existingModal = document.querySelector('.admin-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create admin modal
        const adminModal = document.createElement('div');
        adminModal.className = 'admin-modal';
        adminModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        `;
        
        const adminContent = document.createElement('div');
        adminContent.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 95%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        `;
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Form Submissions (${submissions.length})</h2>
                <button onclick="this.closest('.admin-modal').remove()" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">✕ Close</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <button onclick="exportToCSV()" style="padding: 10px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📊 Export CSV</button>
                <button onclick="showAdminPanel()" style="padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">🔄 Refresh</button>
            </div>
        `;
        
        if (submissions.length === 0) {
            html += '<p style="text-align: center; color: #666; padding: 40px;">No submissions found.</p>';
        } else {
            html += `
                <div style="overflow-x: auto;">
                    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th>Date & Time</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Floors</th>
                                <th>Construction</th>
                                <th>Location</th>
                                <th>Budget</th>
                                <th>Plan</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            submissions.forEach(sub => {
                const date = new Date(sub.timestamp).toLocaleString();
                html += `
                    <tr>
                        <td style="white-space: nowrap;">${date}</td>
                        <td>${sub.name || ''}</td>
                        <td>${sub.phone || ''}</td>
                        <td style="word-break: break-all;">${sub.email || ''}</td>
                        <td>${sub.floors || ''}</td>
                        <td>${sub.construction || ''}</td>
                        <td>${sub.location || ''}</td>
                        <td>${sub.budget || ''}</td>
                        <td>${sub.plan || ''}</td>
                        <td style="max-width: 200px; word-wrap: break-word;">${(sub.message || '').substring(0, 100)}${(sub.message && sub.message.length > 100) ? '...' : ''}</td>
                        <td style="white-space: nowrap;">
                            <button onclick="deleteSubmission('${sub.firebaseId}')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        adminContent.innerHTML = html;
        adminModal.appendChild(adminContent);
        document.body.appendChild(adminModal);
        
        // Close modal when clicking outside
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                adminModal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error showing admin panel:', error);
        alert('Error loading admin panel');
    }
}

function createAdminPanel() {
    const adminButton = document.createElement('button');
    adminButton.textContent = '👨‍💼 Admin Panel';
    adminButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        transition: all 0.3s ease;
    `;
    
    adminButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
    });
    
    adminButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
    });
    
    adminButton.addEventListener('click', showAdminPanel);
    
    document.body.appendChild(adminButton);
}

// ==================================================
// EVENT LISTENERS AND INITIALIZATION
// ==================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Teknix Form System...');
    
    // Initialize Firebase
    await initializeFirebase();
    
    // Setup download button event listeners
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Create admin panel button (remove this line in production)
    createAdminPanel();
    
    console.log('Teknix Form System initialized successfully');
});

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

// Function to get submission statistics
async function getSubmissionStats() {
    try {
        const submissions = await viewAllSubmissions();
        
        const today = new Date().toDateString();
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        
        const stats = {
            total: submissions.length,
            today: submissions.filter(sub => new Date(sub.timestamp).toDateString() === today).length,
            thisWeek: submissions.filter(sub => new Date(sub.timestamp) >= thisWeek).length,
            thisMonth: submissions.filter(sub => new Date(sub.timestamp) >= thisMonth).length
        };
        
        console.log('Submission Statistics:', stats);
        return stats;
        
    } catch (error) {
        console.error('Error getting stats:', error);
        return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    }
}

// Function to backup data
async function backupData() {
    try {
        const submissions = await viewAllSubmissions();
        const backup = {
            timestamp: new Date().toISOString(),
            count: submissions.length,
            data: submissions
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teknix-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Backup completed');
        
    } catch (error) {
        console.error('Error creating backup:', error);
        alert('Error creating backup');
    }
}

// ==================================================
// GLOBAL FUNCTIONS (for console access)
// ==================================================

// Make functions available globally for testing
window.teknixAdmin = {
    viewAllSubmissions,
    exportToCSV,
    getSubmissionStats,
    backupData,
    showAdminPanel,
    deleteSubmission
};

console.log('Teknix Admin functions available at: window.teknixAdmin');