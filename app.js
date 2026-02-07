/**
 * CJ Travel - Final Optimized app.js (English UI, Admin 404 Fix, Instant Logout)
 */

// --- 1. LOGIN LOGIC ---
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value.trim();
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.id : null;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Please fill in all fields.");
        return;
    }

    // --- ADMIN BACKDOOR START (Админ нэвтрэх хэсэг) ---
    if (emailInput === 'admin@cjtravel.com' && passwordInput === '1234') {
        const adminUser = {
            name: "System Admin",
            email: "admin@cjtravel.com",
            role: selectedRole, 
            status: "approved"
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        
        window.location.replace('index.html');
        return; 
    }
    // --- ADMIN BACKDOOR END ---

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        if (response.ok) {
            const user = await response.json();

            if (user.role.toLowerCase() === selectedRole.toLowerCase()) {
                
                if (user.role !== 'traveler' && user.status === 'pending') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.replace('under-review.html');
                    return; 
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));

                const localUsers = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = localUsers.findIndex(u => u.email === user.email);
                if (userIndex === -1) localUsers.push(user);
                else localUsers[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(localUsers));

                window.location.replace('index.html');

            } else {
                alert(`Login Error: You are registered as '${user.role}'.`);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Invalid email or password.");
        }
    } catch (error) {
        console.error("Login Connection Error:", error);
        alert("Could not connect to the server.");
    }
}

// --- 2. PROFILE & LOGOUT (Засагдсан: Шууд гардаг хэсэг) ---
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('index.html');
}

function handleProfileClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (isLoggedIn !== 'true' || !user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role !== 'traveler' && user.status === 'pending') {
        window.location.href = 'under-review.html';
    } else {
        window.location.href = 'profile.html';
    }
}

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
    if (userIndex !== -1) users[userIndex] = { ...users[userIndex], ...currentUser };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));

    alert("Profile updated successfully!");
    window.location.href = 'profile.html';
}

// --- 3. UI EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (isLoggedIn !== 'true' || !user) {
            window.location.replace('login.html');
            return;
        }

        if (user.role !== 'traveler' && user.status === 'pending') {
            window.location.replace('under-review.html');
            return;
        }

        if (document.getElementById('userName')) document.getElementById('userName').textContent = user.name;
        if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = user.email;
        if (document.getElementById('userRole')) document.getElementById('userRole').textContent = "Account Type: " + user.role;
    }
});
