/**
 * CJ Travel - Main Application Script (Full Version)
 */

// --- 1. Authentication & Database Functions ---

async function registerUser() {
    const nameInput = document.getElementById('name')?.value;
    const emailInput = document.getElementById('email')?.value;
    const passwordInput = document.getElementById('password')?.value;
    const roleInput = document.querySelector('input[name="role"]:checked')?.id;

    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
        alert("Please fill in all fields and select your account type.");
        return;
    }

    const userData = {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        role: roleInput,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            alert("Registration successful! Your data has been saved to the database.");
            window.location.href = 'login.html';
        } else {
            alert("Error saving data to the server.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Connection failed. Please check your internet.");
    }
}

function loginUser() {
    const emailInput = document.getElementById('login-email')?.value;
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRole = document.querySelector('input[name="role"]:checked')?.id;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Please enter your credentials and select your role.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const authenticatedUser = users.find(u => 
        u.email === emailInput && u.password === passwordInput && u.role === selectedRole
    );

    if (authenticatedUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        alert("Welcome back, " + authenticatedUser.name + "!");
        window.location.href = 'index.html';
    } else {
        alert("Login failed! Invalid credentials or role.");
    }
}

function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    }
}

function handleProfileClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    window.location.href = (isLoggedIn === 'true') ? 'profile.html' : 'login.html';
}

// --- 2. Profile Management Functions (Previously missing part) ---

function loadUserProfileForEditing() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (document.getElementById('edit-name')) document.getElementById('edit-name').value = currentUser.name || '';
    if (document.getElementById('edit-email')) document.getElementById('edit-email').value = currentUser.email || '';
    if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = currentUser.phone || '';
    if (document.getElementById('edit-bio')) document.getElementById('edit-bio').value = currentUser.bio || '';
}

function saveProfileChanges() {
    const nameValue = document.getElementById('edit-name')?.value;
    const phoneValue = document.getElementById('edit-phone')?.value;
    const bioValue = document.getElementById('edit-bio')?.value;

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (!currentUser) return;

    currentUser.name = nameValue;
    currentUser.phone = phoneValue;
    currentUser.bio = bioValue;

    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...currentUser };
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));

    alert("Profile updated successfully!");
    window.location.href = 'profile.html';
}

// --- 3. UI Logic & Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Password Toggle
    const passwordField = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');

    if (passwordField && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isTypePassword = passwordField.type === 'password';
            passwordField.type = isTypePassword ? 'text' : 'password';
            const icon = toggleBtn.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = isTypePassword ? 'visibility_off' : 'visibility';
        });
    }

    // Profile Page Data Rendering
    if (window.location.pathname.includes('profile.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const nameDisplay = document.getElementById('userName');
            const emailDisplay = document.getElementById('userEmail');
            const roleDisplay = document.getElementById('userRole');

            if (nameDisplay) nameDisplay.textContent = currentUser.name;
            if (emailDisplay) emailDisplay.textContent = currentUser.email;
            if (roleDisplay) roleDisplay.textContent = "Account Type: " + currentUser.role;
        }
    }
});
