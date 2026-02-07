/**
 * CJ Travel - Final Optimized app.js (Admin Backdoor Added)
 */

// --- 1. LOGIN LOGIC (MongoDB + Role Validation + Status Check) ---
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value.trim();
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.id : null;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Мэдээллээ бүрэн оруулна уу.");
        return;
    }

    // --- ADMIN BACKDOOR START ---
    if (emailInput === 'admin@cjtravel.com' && passwordInput === '1234') {
        const adminUser = {
            name: "Систем Админ",
            email: "admin@cjtravel.com",
            role: selectedRole, 
            status: "approved"
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        
        if (selectedRole === 'guide') window.location.replace('guide-home.html');
        else if (selectedRole === 'provider') window.location.replace('provider-home.html');
        else window.location.replace('index.html');
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

            // Роль шалгах
            if (user.role.toLowerCase() === selectedRole.toLowerCase()) {
                
                // Статус шалгах: Pending бол
                if (user.role !== 'traveler' && user.status === 'pending') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.replace('under-review.html');
                    return; 
                }

                // Зөвшөөрөгдсөн хэрэглэгчид
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));

                // LocalStorage sync
                const localUsers = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = localUsers.findIndex(u => u.email === user.email);
                if (userIndex === -1) localUsers.push(user);
                else localUsers[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(localUsers));

                // Шууд шилжүүлнэ
                if (selectedRole === 'guide') window.location.replace('guide-home.html');
                else if (selectedRole === 'provider') window.location.replace('provider-home.html');
                else window.location.replace('index.html');

            } else {
                alert(`Нэвтрэх алдаа: Та '${user.role}' эрхээр бүртгүүлсэн байна.`);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Имэйл эсвэл нууц үг буруу байна.");
        }
    } catch (error) {
        console.error("Login Connection Error:", error);
        alert("Сервертэй холбогдож чадсангүй.");
    }
}

// --- 2. PROFILE & LOGOUT ---
function logoutUser() {
    if (confirm("Гарахдаа итгэлтэй байна уу?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    }
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

    alert("Профайл шинэчлэгдлээ!");
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
