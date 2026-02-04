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
 * Validates credentials and sets login status.
 */
function loginUser() {
    // 1. Input талбаруудаас утгыг нь авах
    const emailInput = document.getElementById('login-email')?.value;
    const passwordInput = document.getElementById('login-password')?.value;

    if (!emailInput || !passwordInput) {
        alert("Please fill in all fields.");
        return;
    }

    // 2. LocalStorage-аас бүртгэлтэй хэрэглэгчдийг авах
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 3. Хэрэглэгч байгаа эсэхийг шалгах
    const userFound = users.find(u => u.email === emailInput && u.password === passwordInput);

    if (userFound) {
        localStorage.setItem('isLoggedIn', 'true');
        // Нэвтэрсний дараа нүүр хуудас руу шилжүүлнэ
        window.location.href = 'index.html';
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

/**
 * Clears login status and redirects to the Home page.
 */
function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        // Logout хийхэд Нүүр хуудас (index.html) руу шилжинэ
        window.location.href = "index.html";
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
            return;
        }

        // Display user data
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.length > 0) {
            const currentUser = users[users.length - 1];

            const nameElement = document.getElementById('userName');
            const emailElement = document.getElementById('userEmail');

            if (nameElement) nameElement.textContent = currentUser.name;
            if (emailElement) emailElement.textContent = currentUser.email;
        }
    }
});
