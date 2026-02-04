/**
 * CJ Travel - Main Application Script
 * Managing global navigation, authentication, and UI interactions.
 */

// --- 1. Authentication Functions ---

/**
 * Checks if the user is logged in and directs them to the correct page.
 */
function handleProfileClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

/**
 * Sets login status and redirects to profile.
 */
function loginUser() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'profile.html';
}

/**
 * Clears login status and redirects to home.
 */
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// --- 2. UI Helper Functions ---

/**
 * Initializing page-specific features when the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Password Visibility Toggle (for login.html)
    const passwordInput = document.querySelector('input[type="password"]');
    const toggleBtn = passwordInput ? passwordInput.nextElementSibling : null;

    if (passwordInput && toggleBtn && toggleBtn.querySelector('.material-symbols-outlined')) {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.innerHTML = '<span class="material-symbols-outlined">visibility_off</span>';
            } else {
                passwordInput.type = 'password';
                toggleBtn.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
            }
        });
    }

    // Protection for profile page
    if (window.location.pathname.includes('profile.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }
});
