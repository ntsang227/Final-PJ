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
const loginForm = document.querySelector('#login-form');
const errorMsg = document.querySelector('#error-msg');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // Gọi API lấy danh sách admin từ server
  fetch('../../../public/App.js')
    .then(response => response.json())
    .then(admins => {
      // Tìm kiếm thông tin admin trong danh sách lấy về
      const admin = admins.find(admin => admin.username === username && admin.password === password);

      // Kiểm tra thông tin đăng nhập
      if (admin) {
        // Chuyển hướng đến trang chính
        window.location.href = './admin/home.html';
      } else {
        // Hiển thị thông báo lỗi
        errorMsg.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
      }
    })
    .catch(error => console.error(error));
});*/

