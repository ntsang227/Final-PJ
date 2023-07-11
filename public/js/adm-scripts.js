function updateFileName(input) {
    var label = input.nextElementSibling; // Lấy phần tử tiếp theo (em trỏ) của input
    var fileName = input.files[0].name; // Lấy tên của tệp tin đã chọn
    label.innerText = fileName; // Cập nhật nội dung của label thành tên của tệp tin đã chọn
}
