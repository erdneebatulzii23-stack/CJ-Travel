/**
 * CJ Travel - Main Application Script
 * Managing global navigation and user authentication status.
 */

/**
 * Handles navigation logic for the Profile section.
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
 * Function to simulate user login.
 */
function loginUser() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'profile.html';
}

/**
 * Function to log the user out.
 */
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}
