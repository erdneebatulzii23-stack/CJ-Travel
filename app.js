/**
 * CJ Travel - Optimized app.js (MongoDB Integrated)
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

    // --- ADMIN BACKDOOR START ---
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
                
                // Хадгалах
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Батлагдаагүй (Pending) эсэхийг шалгах
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
        console.error("Login Connection Error:", error);
        alert("Could not connect to the server.");
    }
}

// --- 2. POSTS LOGIC (Шинээр нэмэгдсэн) ---

// Постуудыг дата баазаас татаж харуулах
async function loadPosts() {
    const postContainer = document.getElementById('post-container');
    if (!postContainer) return;

    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        postContainer.innerHTML = ''; 

        posts.forEach(post => {
            const postHtml = `
                <div class="post">
                    <div class="post-header">
                        <img src="${post.userPic || 'default-avatar.png'}" class="avatar">
                        <h4>${post.userName}</h4>
                    </div>
                    <p>${post.text}</p>
                    ${post.image ? `<img src="${post.image}" class="post-img">` : ''}
                    <div class="post-actions">
                        <button onclick="likePost('${post._id}')">❤️ ${post.likes?.length || 0}</button>
                    </div>
                </div>
            `;
            postContainer.insertAdjacentHTML('beforeend', postHtml);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

// Шинэ пост оруулах
async function addPost() {
    const postInput = document.getElementById('postInput');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Please login first!");
        return;
    }

    if (!postInput.value.trim()) return;

    const postData = {
        text: postInput.value,
        userId: user.id,
        userName: user.name,
        userPic: user.profilePic || "",
        image: "" // Зураг оруулах хэсэг дараагийн алхамд
    };

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            postInput.value = '';
            loadPosts(); // Постуудыг шинэчлэх
        }
    } catch (error) {
        alert("Error posting.");
    }
}

// --- 3. PROFILE & LOGOUT ---
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
}

// ... Бусад handleProfileClick болон saveProfile хэсэг хэвээрээ байна ...
