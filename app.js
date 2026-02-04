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
/**
 * Profile page logic: 
 * Updates the UI with user information from LocalStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve users array from LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 2. Select the most recently registered user
    if (users.length > 0) {
        const currentUser = users[users.length - 1];

        // 3. Find target elements using CSS selectors
        const nameElement = document.querySelector('p.text-\\[22px\\]');
        const emailElement = document.querySelector('p.text-\\[#4c739a\\]');

        // 4. Update the UI text content
        if (nameElement) nameElement.textContent = currentUser.name;
        if (emailElement) emailElement.textContent = currentUser.email;
    }
});
/**
 * Profile page logic: 
 * Updates the UI with user information from LocalStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve users array from LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 2. Select the most recently registered user
    if (users.length > 0) {
        const currentUser = users[users.length - 1];

        // 3. Find target elements using CSS selectors
        const nameElement = document.querySelector('p.text-\\[22px\\]');
        const emailElement = document.querySelector('p.text-\\[#4c739a\\]');

        // 4. Update the UI text content
        if (nameElement) nameElement.textContent = currentUser.name;
        if (emailElement) emailElement.textContent = currentUser.email;
    }
});

/**
 * Profile page logic: 
 * Updates the UI with user information from LocalStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve users array from LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 2. Select the most recently registered user
    if (users.length > 0) {
        const currentUser = users[users.length - 1];

        // 3. Find target elements using CSS selectors
        const nameElement = document.querySelector('p.text-\\[22px\\]');
        const emailElement = document.querySelector('p.text-\\[#4c739a\\]');

        // 4. Update the UI text content
        if (nameElement) nameElement.textContent = currentUser.name;
        if (emailElement) emailElement.textContent = currentUser.email;
    }
});

/**
 * Handle user logout functionality
 */
function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        // Redirect back to the registration page
        window.location.href = "traveler-setup.html";
    }
}
