
const loginForm = document.querySelector('#login-form');
const errorMsg = document.querySelector('#error-msg');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    
    // Kiểm tra thông tin đăng nhập
    if (username === 'admin' && password === '12345') {
        // Chuyển hướng đến trang chính
        window.location.href = './admin/home.html';
    } else {
        // Hiển thị thông báo lỗi
        errorMsg.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
    }
});
/*
    // Kiểm tra xem người dùng có phải là một quản trị viên hay không
    const isAdmin = admins.find(admin => admin.username === username && admin.password === password);
    
    if (isAdmin) {
      // Nếu người dùng là một quản trị viên, chuyển hướng sang trang home.html
      window.location.href = 'home.html';
    } else {
      // Nếu không phải, hiển thị thông báo lỗi
      alert('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  })
  .catch(error => console.error(error));
  console.log(response.json());
*/