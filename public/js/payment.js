// Hàm xử lý postPayment
let isSending = false;

const postPayment = async () => {
    if (isSending) return;
    if (window.confirm('Thêm số tiền test thành công')) {
        setTimeout(function() {
          location.reload();
        }, 1000);
      }else {
        setTimeout(function() {
            location.reload();
          }, 1000);
      }
  try {
    isSending = true;
    await fetch('/tutor/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'success' })
    });
    isSending = false;
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu: ', error);
    isSending = false;
  }
};