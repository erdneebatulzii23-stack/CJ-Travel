/**
 * CJ Travel - Final Optimized app.js
 */

// 1. БҮРТГҮҮЛЭХ ХЭСЭГ (MongoDB + 401 алдаанаас сэргийлсэн)
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

// 2. НЭВТРЭХ ХЭСЭГ (Одоо MongoDB-ээс датагаа шалгадаг болсон)
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value;
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRole = document.querySelector('input[name="role"]:checked')?.id;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Мэдээллээ бүрэн оруулна уу.");
        return;
    }

    try {
        // Энд өөрийн үүсгэсэн api/login.js-ийг дуудаж байна
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        if (response.ok) {
            const user = await response.json();

            // Роль нь таарч байгаа эсэхийг шалгана
            if (user.role.toLowerCase() === selectedRole.toLowerCase()) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // LocalStorage-д хэрэглэгчийг шинэчлэх (Профайл засварлахад хэрэгтэй)
                const localUsers = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = localUsers.findIndex(u => u.email === user.email);
                if (userIndex === -1) localUsers.push(user);
                else localUsers[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(localUsers));

                alert("Тавтай морил, " + user.name + "!");
                window.location.replace('index.html');
            } else {
                alert(`Нэвтрэх алдаа: Та '${user.role}' эрхээр бүртгүүлсэн байна. Одоо '${selectedRole}' гэж нэвтрэх боломжгүй.`);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Имэйл эсвэл нууц үг буруу байна.");
        }
    } catch (error) {
        console.error("Login Connection Error:", error);
        alert("Нэвтрэхэд алдаа гарлаа. Серверээ шалгана уу.");
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

// 4. ПРОФАЙЛ ЗАСВАРЛАХ 
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

// 5. UI EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Нууц үг харах/нуух
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

    // Профайл хуудас ачаалагдахад датаг харуулах
    if (window.location.pathname.includes('profile.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.replace('login.html');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (document.getElementById('userName')) document.getElementById('userName').textContent = currentUser.name;
            if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = currentUser.email;
            if (document.getElementById('userRole')) document.getElementById('userRole').textContent = "Account Type: " + currentUser.role;
        }
    }
});
