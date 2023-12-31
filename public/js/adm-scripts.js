function updateFileName(input) {
    var label = input.nextElementSibling; // Lấy phần tử tiếp theo (em trỏ) của input
    var fileName = input.files[0].name; // Lấy tên của tệp tin đã chọn
    label.innerText = fileName; // Cập nhật nội dung của label thành tên của tệp tin đã chọn
}
function confirmAction(url) {
    if (confirm("Bạn có chắc chắn muốn thực hiện hành động này?")) {
        let message = "Thao tác thành công!"; // Tin nhắn thành công từ máy chủ
        setTimeout(function() {
            alert(message);
            window.location.href = url;
        }, 2000); // Delay 3 giây trước khi chuyển hướng
    }
}
function urlAction(url) {
    window.location.href = url;
}
//tính thời gian
function calculateTimeDifference(createdAt) {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
  
    // Tính số giờ chênh lệch
    const timeDifferenceInHours = Math.round(
      (currentTime.getTime() - createdAtTime.getTime()) / (1000 * 60 * 60)
    );
  
    return `${timeDifferenceInHours} giờ trước`;
  }
  function hideNews(newsId) {
    // Gửi yêu cầu AJAX đến API
    fetch(`/admin/news/hidden/${newsId}`, {
        method: 'POST', // Hoặc bạn có thể sử dụng method 'PUT' tùy vào thiết kế của API của bạn
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.message) {
                // Hiển thị thông báo thành công
                alert(data.message);
                location.reload();
            } else {
                // Hiển thị thông báo lỗi (nếu có)
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu ẩn tin tức:', error);
        });
}
function showNews(newsId) {
    // Gửi yêu cầu AJAX đến API
    fetch(`/admin/news/show/${newsId}`, {
        method: 'POST', // Hoặc bạn có thể sử dụng method 'PUT' tùy vào thiết kế của API của bạn
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.message) {
                // Hiển thị thông báo thành công
                alert(data.message);
                location.reload();
            } else {
                // Hiển thị thông báo lỗi (nếu có)
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu ẩn tin tức:', error);
        });
}   
function showCourse(courseId) {
    // Gửi yêu cầu AJAX đến API
    fetch(`/admin/course/show/${courseId}`, {
        method: 'POST', // Hoặc bạn có thể sử dụng method 'PUT' tùy vào thiết kế của API của bạn
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.message) {
                // Hiển thị thông báo thành công
                alert(data.message);
                location.reload();
            } else {
                // Hiển thị thông báo lỗi (nếu có)
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu ẩn tin tức:', error);
        });
}  
function hiddenCourse(courseId) {
    // Gửi yêu cầu AJAX đến API
    fetch(`/admin/course/hidden/${courseId}`, {
        method: 'POST', // Hoặc bạn có thể sử dụng method 'PUT' tùy vào thiết kế của API của bạn
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.message) {
                // Hiển thị thông báo thành công
                alert(data.message);
                location.reload();
            } else {
                // Hiển thị thông báo lỗi (nếu có)
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu ẩn tin tức:', error);
        });
}    
