/**
 * CJ Travel - Main Application Script
 * Managing global navigation, authentication, and UI interactions.
 */

// --- 1. Authentication Functions ---

/**
 * Saves new user data to LocalStorage during registration.
 * Should be linked to the 'Continue' button in traveler-setup.html.
 */
function registerUser() {
    // Get values from input fields
    const nameInput = document.getElementById('name')?.value;
    const emailInput = document.getElementById('email')?.value;
    const passwordInput = document.getElementById('password')?.value;

    // Basic validation
    if (!nameInput || !emailInput || !passwordInput) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Retrieve existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(user => user.email === emailInput)) {
        alert("This email is already registered. Please login.");
        return;
    }

    // Add new user to the list
    users.push({ 
        name: nameInput, 
        email: emailInput, 
        password: passwordInput 
    });

    // Save updated list back to LocalStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login...");
    window.location.href = 'login.html';
}

/**
 * Validates credentials and sets login status.
 * Linked to the 'Login' button in login.html.
 */
function loginUser() {
    const emailInput = document.getElementById('login-email')?.value;
    const passwordInput = document.getElementById('login-password')?.value;

    if (!emailInput || !passwordInput) {
        alert("Please enter both email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const authenticatedUser = users.find(u => u.email === emailInput && u.password === passwordInput);

    if (authenticatedUser) {
        // Set session states
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials. Please try again.");
    }
}

/**
 * Clears session data and redirects to the landing page.
 */
function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    }
}

/**
 * Handles profile access based on authentication state.
 */
function handleProfileClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    window.location.href = (isLoggedIn === 'true') ? 'profile.html' : 'login.html';
}

// --- 2. Page Initialization & UI Logic ---

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Password Visibility Toggle
    const passwordField = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');

    if (passwordField && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isTypePassword = passwordField.type === 'password';
            passwordField.type = isTypePassword ? 'text' : 'password';
            
            const icon = toggleBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isTypePassword ? 'visibility_off' : 'visibility';
            }
        });
    }

    // B. Profile Page Data Rendering
    if (window.location.pathname.includes('profile.html')) {
        // Security Guard: Redirect if unauthorized
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        // Display data of the currently logged-in user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            const nameDisplay = document.getElementById('userName');
            const emailDisplay = document.getElementById('userEmail');

            if (nameDisplay) nameDisplay.textContent = currentUser.name;
            if (emailDisplay) emailDisplay.textContent = currentUser.email;
        }
    }
});
