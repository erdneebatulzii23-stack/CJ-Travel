/**
 * CJ Travel - Final Optimized app.js (Fixed Syntax)
 * Бүх логик (Login, Profile, Post, Like) нэгтгэгдсэн хувилбар
 */

// --- 1. LOGIN & AUTH LOGIC ---
async function loginUser() {
    const emailInput = document.getElementById('login-email')?.value.trim();
    const passwordInput = document.getElementById('login-password')?.value;
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.id : null;

    if (!emailInput || !passwordInput || !selectedRole) {
        alert("Please fill in all fields.");
        return;
    }

    // ADMIN BACKDOOR
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

// --- 2. POST & LIKE LOGIC ---

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
            postInput.value = '';
            if (document.getElementById('user-posts-container')) loadUserPosts();
            if (document.getElementById('post-container')) loadPosts();
        }
    } catch (error) {
        console.error("Post Error:", error);
    }
}

async function loadPosts() {
    const container = document.getElementById('post-container');
    if (!container) return;

    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        container.innerHTML = posts.map(post => renderPostHTML(post)).join('');
    } catch (error) {
        console.error("Load Posts Error:", error);
    }
}

async function loadUserPosts() {
    const container = document.getElementById('user-posts-container');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!container || !user) return;

    try {
        const response = await fetch('/api/posts');
        const allPosts = await response.json();
        const myId = user.id || user._id;
        const myPosts = allPosts.filter(p => p.userId === myId);

        container.innerHTML = myPosts.length > 0 
            ? myPosts.map(post => renderPostHTML(post)).join('')
            : "<p>You haven't posted anything yet.</p>";
    } catch (error) {
        console.error("Load User Posts Error:", error);
    }
}

function renderPostHTML(post) {
    return `
        <div class="post-card" style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="${post.userPic}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                <strong>${post.userName}</strong>
            </div>
            <p>${post.text}</p>
            <div style="margin-top: 10px;">
                <button onclick="likePost('${post._id}')" style="cursor:pointer; border:none; background:none;">
                    ❤️ ${post.likes ? post.likes.length : 0} Likes
                </button>
                <small style="color: #888; margin-left: 15px;">${new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
        </div>
    `;
}

async function likePost(postId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return alert("Please login to like!");

    try {
        await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: postId, userId: user.id || user._id })
        });
        if (document.getElementById('post-container')) loadPosts();
        if (document.getElementById('user-posts-container')) loadUserPosts();
    } catch (error) {
        console.error("Like Error:", error);
    }
}

// --- 3. UI INITIALIZATION & UTILS ---

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (window.location.pathname.includes('profile.html')) {
        if (isLoggedIn !== 'true' || !user) {
            window.location.replace('login.html');
            return;
        }
        if (document.getElementById('userName')) document.getElementById('userName').textContent = user.name;
        if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = user.email;
        loadUserPosts();
    }

    if (document.getElementById('post-container')) {
        loadPosts();
    }
});

// ГАРУУД ЦЭВЭРЛЭЖ ЗАСАВ
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
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
