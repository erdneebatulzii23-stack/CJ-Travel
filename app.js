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
    window.location.href = (isLoggedIn === 'true') ? 'profile.html' : 'login.html';
}

/**
 * Sets login status and redirects to profile.
 */
function loginUser() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'profile.html';
}

/**
 * Clears login status and redirects to the setup or landing page.
 */
function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "traveler-setup.html";
    }
}

// --- 2. UI and Page Logic ---

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Password Visibility Toggle Logic
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

    // B. Profile Page Logic (Security & Data Display)
    if (window.location.pathname.includes('profile.html')) {
        // Security check: Redirect if not logged in
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return; // Stop further execution
        }

        // Display user data
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.length > 0) {
            const currentUser = users[users.length - 1];

            // Select elements by ID (Your profile.html now uses these IDs)
            const nameElement = document.getElementById('userName');
            const emailElement = document.getElementById('userEmail');

            if (nameElement) nameElement.textContent = currentUser.name;
            if (emailElement) emailElement.textContent = currentUser.email;
        }
    }
});
