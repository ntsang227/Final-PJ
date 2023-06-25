
// đối tượng danh sách môn học
const subjectList = {
  primary: ['Toán học', 'Tiếng Miêng', 'Tiếng FiFai'],
  secondary: ['Toán học', 'Tiếng Miêng','Tiếng Anh', 'Vật Lý','Hóa Học'],
  'high-school': ['Toán học', 'Ngữ Văn','Tiếng Anh', 'Vật Lý','Hóa Học', 'Sinh Học','Lịch Sử', 'Địa Lý'],
  'training-high-school': ['Toán học', 'Ngữ Văn','Tiếng Anh', 'Vật Lý','Hóa Học', 'Sinh Học','Lịch Sử', 'Địa Lý','GDCD'],
  'english-cerificate': ['Tiếng Anh cơ bản', 'Tiếng Anh nâng cao'],
  'english-communication': ['Tiếng Anh giao tiếp']
  }
          
// hàm cập nhật danh sách môn học
  function updateSubjectList() {
    const selectedGrade = document.getElementById('grade-select').value;
    const subjectSelect = document.getElementById('subject-select');
          
    // xóa các option cũ
    while (subjectSelect.options.length > 1) {
      subjectSelect.remove(1);
    }
          
    // thêm các option mới tương ứng với lớp học được chọn
    if (subjectList[selectedGrade]) {
      for (let i = 0; i < subjectList[selectedGrade].length; i++) {
        const subject = subjectList[selectedGrade][i];
        const option = document.createElement('option');
        option.value = subject;
        option.text = subject;
        subjectSelect.add(option);
        }
        subjectSelect.disabled = false;
        } else {
         subjectSelect.disabled = true;
      }
    }
function validate() {
  var message = "Bạn có chắc muốn đăng ký lớp này không?";
  if (confirm(message)) {
    setTimeout(function() {
      window.location.href = "/tutor/home";
      showSuccessAlert()
    }, 3000); // Thời gian chuyển hướng sau khi hiển thị thông báo thành công
  } else {
        // Nếu người dùng nhấn Cancel, không làm gì
  }
}
function showSuccessAlert() {
  alert("Đăng ký lớp thành công!");
}
               
