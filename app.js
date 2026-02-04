/**
 * CJ Travel - Main Application Script
 * Managing global navigation and user authentication status.
 */

/**
 * Handles navigation logic for the Profile section.
 * Checks if the user is logged in using localStorage.
 */
function handleProfileClick() {
    // Check the authentication status in the browser's local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        // Redirect to the profile page if user is authenticated
        window.location.href = 'profile.html';
    } else {
        // Redirect to the login page if user is not authenticated
        window.location.href = 'login.html';
    }
}

/**
 * Example function to simulate user login.
 * This should be called when the user successfully logs in.
 */
function loginUser() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'profile.html';
}

/**
 * Example function to log the user out.
 * Clears the authentication status from local storage.
 */
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}
