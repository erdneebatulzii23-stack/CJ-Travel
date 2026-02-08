/**
 * CJ Travel - Final Optimized app.js
 * Пост оруулах, харах, лайк дарах горим бүрэн орсон хувилбар
 */

// --- 1. LOGIN & AUTH (Хэвээр үлдээв) ---
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value.trim();
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.id : null;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Please fill in all fields.");
        return;
    }

    if (emailInput === 'admin@cjtravel.com' && passwordInput === '1234') {
        const adminUser = {
            id: "admin_001",
            name: "System Admin",
            email: "admin@cjtravel.com",
            role: selectedRole, 
            status: "approved",
            profilePic: "https://i.pravatar.cc/150?u=admin"
        };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.location.replace('index.html');
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
            if (user.role.toLowerCase() === selectedRole.toLowerCase()) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (user.role !== 'traveler' && user.status === 'pending') {
                    window.location.replace('under-review.html');
                } else {
                    window.location.replace('index.html');
                }
            } else {
                alert(`Login Error: You are registered as '${user.role}'.`);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Invalid email or password.");
        }
    } catch (error) {
        alert("Could not connect to the server.");
    }
}

// --- 2. POSTING SYSTEM (Энэ хэсэгт пост харах, оруулах горим байна) ---

// Шинэ пост оруулах
async function addPost() {
    const postInput = document.getElementById('postInput');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) return alert("Please login first!");
    if (!postInput.value.trim()) return;

    const postData = {
        text: postInput.value,
        userId: user.id || user._id,
        userName: user.name,
        userPic: user.profilePic || "https://i.pravatar.cc/150",
        createdAt: new Date()
    };

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            postInput.value = ''; // Текст талбарыг цэвэрлэх
            loadPosts(); // Шинэ постыг шууд харуулах
        }
    } catch (error) {
        console.error("Post Error:", error);
    }
}

// Бүх постуудыг баазаас уншиж харуулах
async function loadPosts() {
    const container = document.getElementById('post-container');
    if (!container) return;

    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        // Хамгийн сүүлийн пост дээрээ харагдахаар эрэмбэлэх
        const sortedPosts = posts.reverse();
        
        container.innerHTML = sortedPosts.map(post => `
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                <div class="flex items-center gap-3 mb-3">
                    <img src="${post.userPic}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <h4 class="font-bold text-slate-900 dark:text-white">${post.userName}</h4>
                        <span class="text-xs text-slate-500">${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mb-4">${post.text}</p>
                <div class="flex items-center gap-4 pt-3 border-t border-slate-50 dark:border-slate-700">
                    <button onclick="likePost('${post._id}')" class="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors">
                        <span class="material-symbols-outlined text-xl">favorite</span>
                        <span>${post.likes ? post.likes.length : 0}</span>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Load Posts Error:", error);
    }
}

// Лайк дарах горим
async function likePost(postId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return alert("Please login to like!");

    try {
        await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: postId, userId: user.id || user._id })
        });
        loadPosts(); // Тоог шинэчлэх
    } catch (error) {
        console.error("Like Error:", error);
    }
}

// --- 3. UI INITIALIZATION & NAVIGATION ---

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Хэрэв нүүр хуудас бол постуудыг ачаалах
    if (document.getElementById('post-container')) {
        loadPosts();
    }

    // Профайл хуудас дээрх мэдээлэл
    if (window.location.pathname.includes('profile.html')) {
        if (isLoggedIn !== 'true' || !user) {
            window.location.replace('login.html');
            return;
        }
        if (document.getElementById('userName')) document.getElementById('userName').textContent = user.name;
        if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = user.email;
    }
});

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

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
}
