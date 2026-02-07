/**
 * CJ Travel - Final Integrated app.js (MongoDB + Multi-Role + Profile Management)
 */

// 1. БҮРТГҮҮЛЭХ ХЭСЭГ (MongoDB + LocalStorage Sync)
async function registerUser() {
    const nameInput = document.getElementById('name')?.value;
    const emailInput = document.getElementById('email')?.value;
    const passwordInput = document.getElementById('password')?.value;
    const roleInput = document.querySelector('input[name="role"]:checked')?.id;

    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
        alert("Бүх талбарыг бөглөнө үү.");
        return;
    }

    const userData = {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        role: roleInput.toLowerCase(), 
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/save', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            // LocalStorage sync
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            alert("Бүртгэл амжилттай! MongoDB-д хадгалагдлаа.");
            window.location.replace('login.html'); 
        } else {
            const errorData = await response.json();
            alert("Сервер алдаа: " + (errorData.message || "Алдаа гарлаа."));
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Сервертэй холбогдож чадсангүй.");
    }
}

// 2. НЭВТРЭХ ХЭСЭГ (MongoDB + Role Validation + Dashboard Redirect)
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value.trim();
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.id : null;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Мэдээллээ бүрэн оруулна уу.");
        return;
    }

    // --- ADMIN CHECK ---
    if (emailInput === "admin@travel.mn" && passwordInput === "1234") {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ email: emailInput, role: 'admin', name: 'Admin' }));
        window.location.replace("admin-dashboard.html");
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        if (response.ok) {
            const user = await response.json();

            // Role check logic (Хэрэглэгчийн бааз дахь role сонгосон role-той таарч буй эсэх)
            // Жишээ нь: 'traveler', 'guide', 'company' (provider)
            let canLogin = false;
            let targetPage = "index.html";

            // Хэрэв MongoDB-д 'role' талбар байгаа бол шалгана
            if (user.role === selectedRole || (user.businessDetails && user.businessDetails.type === (selectedRole === 'company' ? 'provider' : selectedRole))) {
                canLogin = true;
                
                // Хаашаа үсрэхийг шийдэх
                if (selectedRole === 'guide') targetPage = "guide-home.html";
                else if (selectedRole === 'company') targetPage = "provider-home.html";
                else targetPage = "index.html";
            }

            if (canLogin) {
                // Pending төлөв шалгах
                if (user.businessDetails && user.businessDetails.status === 'pending') {
                    window.location.replace("under-review.html");
                    return;
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // LocalStorage sync
                const localUsers = JSON.parse(localStorage.getItem('users')) || [];
                const idx = localUsers.findIndex(u => u.email === user.email);
                if (idx === -1) localUsers.push(user);
                else localUsers[idx] = user;
                localStorage.setItem('users', JSON.stringify(localUsers));

                alert(`Тавтай морил, ${user.name}!`);
                window.location.replace(targetPage);
            } else {
                alert(`Нэвтрэх алдаа: Та '${user.role || 'өөр'}' эрхээр бүртгүүлсэн байна.`);
            }
        } else {
            const err = await response.json();
            alert(err.message || "Имэйл эсвэл нууц үг буруу байна.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Сервертэй холбогдоход алдаа гарлаа.");
    }
}

// 3. ГАРАХ ХЭСЭГ
function logoutUser() {
    if (confirm("Гарахдаа итгэлтэй байна уу?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    }
}

function handleProfileClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    window.location.href = (isLoggedIn === 'true') ? 'profile.html' : 'login.html';
}

// 4. ПРОФАЙЛ ЗАСВАРЛАХ (Хуучин логик хэвээрээ)
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

    alert("Профайл амжилттай шинэчлэгдлээ!");
    window.location.href = 'profile.html';
}

// 5. UI EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Нууц үг харах/нуух
    const passwordField = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');

    if (passwordField && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isTypePassword = passwordField.type === 'password';
            passwordField.type = isTypePassword ? 'text' : 'password';
            const icon = toggleBtn.querySelector('span'); // Material icon span
            if (icon) icon.textContent = isTypePassword ? 'visibility_off' : 'visibility';
        });
    }

    // Профайл хуудасны өгөгдөл харуулах
    if (window.location.pathname.includes('profile.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.replace('login.html');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (document.getElementById('userName')) document.getElementById('userName').textContent = currentUser.name;
            if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = currentUser.email;
            if (document.getElementById('userRole')) document.getElementById('userRole').textContent = "Account Type: " + (currentUser.role || 'User');
        }
    }
});
