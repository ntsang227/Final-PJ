
// đối tượng danh sách môn học
const subjectList = {
  primary: ['Tiếng Anh', 'Toán', 'Tiếng Việt'],
  secondary: ['Tiếng Anh', 'Toán', 'Vật Lý','Hóa Học', 'Sinh Học', 'Ngữ Văn'],
  'high-school': ['Tiếng Anh', 'Toán', 'Vật Lý','Hóa Học', 'Sinh Học', 'Ngữ Văn'],
  'training-high-school': ['Khối A', 'Khối B','Khối C', 'Khối D'],
  'english-certificate': ['Chứng chỉ IELTS', 'Chứng chỉ TOEIC', 'Chứng chỉ TOEFL', 'Chứng chỉ SAT'],
  'english-communication': ['Mất gốc', 'Căn bản', 'Nâng cao']
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
               
