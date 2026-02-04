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
    
    // 1. Password Visibility Toggle Logic
    const passwordInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');

    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = toggleBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isPassword ? 'visibility_off' : 'visibility';
            }
        });
    }

    // 2. Profile Page Protection
    if (window.location.pathname.includes('profile.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }
});
