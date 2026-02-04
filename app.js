/**
 * CJ Travel - Main Application Script
 * Managing global navigation, authentication, and UI interactions.
 */

// --- 1. Authentication Functions ---

/**
 * Saves new user data including their specific ROLE to LocalStorage.
 */
function registerUser() {
    // Get values from input fields
    const nameInput = document.getElementById('name')?.value;
    const emailInput = document.getElementById('email')?.value;
    const passwordInput = document.getElementById('password')?.value;
    
    // Get the selected role from radio buttons (traveler, guide, or company)
    const roleInput = document.querySelector('input[name="role"]:checked')?.id;

    // Basic validation
    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
        alert("Please fill in all fields and select your account type.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(user => user.email === emailInput)) {
        alert("This email is already registered. Please login.");
        return;
    }

    // Add new user with the assigned role
    users.push({ 
        name: nameInput, 
        email: emailInput, 
        password: passwordInput,
        role: roleInput 
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful as a " + roleInput + "! Redirecting to login...");
    window.location.href = 'login.html';
}

/**
 * Validates credentials AND checks if the selected role matches the database.
 */
function loginUser() {
    const emailInput = document.getElementById('login-email')?.value;
    const passwordInput = document.getElementById('login-password')?.value;
    
    // Get the role selected on the login page
    const selectedRole = document.querySelector('input[name="role"]:checked')?.id;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Please enter your credentials and select your role.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user matching Email, Password, AND Role
    const authenticatedUser = users.find(u => 
        u.email === emailInput && 
        u.password === passwordInput && 
        u.role === selectedRole
    );

    if (authenticatedUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        
        alert("Login successful! Welcome, " + authenticatedUser.name);
        window.location.href = 'index.html';
    } else {
        // If credentials match but role is wrong, or if credentials don't match at all
        alert("Login failed! Please check your email, password, and ensure you selected the correct role.");
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
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            const nameDisplay = document.getElementById('userName');
            const emailDisplay = document.getElementById('userEmail');
            const roleDisplay = document.getElementById('userRole'); // Optional: Add an element with this ID in profile.html

            if (nameDisplay) nameDisplay.textContent = currentUser.name;
            if (emailDisplay) emailDisplay.textContent = currentUser.email;
            if (roleDisplay) roleDisplay.textContent = "Account Type: " + currentUser.role;
        }
    }
});
