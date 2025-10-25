const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login-form, .login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Logic đăng nhập
            localStorage.setItem('isLoggedIn', 'true');
            alert('Đăng nhập thành công!');
            
            const returnUrl = new URLSearchParams(window.location.search).get('return');
            window.location.href = returnUrl || 'index.html';
        });
    }

    // Nút đăng xuất
    const logoutBtn = document.querySelector('.logout-btn, #logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            alert('Đã đăng xuất!');
            window.location.href = 'index.html';
        });
    }

    // Link đến profile
    const profileLink = document.querySelector('.profile-link');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!isLoggedIn) {
                alert('Vui lòng đăng nhập!');
                window.location.href = 'login.html';
            } else {
                window.location.href = 'profile.html';
            }
        });
    }
});