const express = require('express');
const bodyParser = require('body-parser');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const Notification = require('../../db/models/notification.js');
const Apply = require('../../db/models/apply.js');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10

//Yêu cầu chuyển hướng
router.get('/', checkMember, function (req, res) {
  req.session.loggedin_tutor = false;
  res.render('User/main/index.ejs', { email: req.session.email });
});
// Chuyển hướng đến trang home tutor 
router.get('/home', checkMember, async (req, res) => {
  try {
    const emailtutor = req.session.email;
    const tutor = await Tutor.findOne({ email: emailtutor });
    if (tutor) {
      const name = tutor.username;
      const apply = await Apply.find({ nametutor: name }); // Chỉ hiển thị danh sách yêu cầu đăng ký của người đăng bài
      const courses = await Course.find({ status: 'active' });
      res.render('User/main/index.ejs',
      {
        courses,apply
      });
    } else {
      res.status(404).send('Không tìm thấy tài khoản tutor!');
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/courses', checkMember, function (req, res) {
  res.render('User/main/course.ejs', { email: req.session.email });
});
router.get('/detail-course', checkMember, function (req, res) {
  res.render('User/main/detail-courses.ejs', { email: req.session.email });
});
router.get('/calendar', checkMember, function (req, res) {
  res.render('User/main/calendar.ejs', { email: req.session.email });
});
router.get('/detail-courses/:id', checkMember, async function (req, res) {
  try {
    const id = req.params.id;
    const courses = await Course.findById(id);
    res.render('User/main/detail-courses',
      {
        courses,
      });
  }
  catch (error) {
    res.redirect('/courses/');
  }
});
//Chuyển hướng đến đăng kí thành viên
router.get('/register', function (req, res) {
  res.render('User/signup/index.ejs', { message: '' });
});

//Chuyển hướng đến login 
router.get('/login', function (req, res) {
  res.render('User/login/index.ejs', { message: '' });
});
//Post đăng kí tài khoản
router.post('/register', async (req, res) => { //NOSONAR
  const password = req.body.password;
  const hashedPassword = generateHash(password);
  const tutor = new Tutor({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  })
  const newNotification = new Notification({
    name: 'Người dùng mới',
    category: 'newUser',
    actionName: req.body.username
  });
  const email = req.body.email;
  const username = req.body.username;
  const existingUsername = await Tutor.findOne({ username });
  const existingEmail = await Tutor.findOne({ email });
  if (existingEmail) {
    return res.render('User/signup', { message: 'Email đã được đăng ký.' });
  }
  if (existingUsername) {
    return res.render('User/signup', { message: 'Username đã được sử dụng.' });
  }
  try {
    await tutor.save();
    await newNotification.save();
    res.redirect('/tutor/login');
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});
//Post login 
router.post('/login', async function (req, res) { //NOSONAR 
  const username = req.body.login;
  const email = req.body.login;
  const password = req.body.password;
  try {
    const tutor = await Tutor.findOne({ $or: [{ email: email }, { username: username }] });
    const isMatch = bcrypt.compareSync(password, tutor.password);
    console.log(password);
    console.log(tutor.password);
    if (!tutor) {
      res.render('User/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    } else if (!isMatch) {
      res.render('User/login', { message: 'Mật khẩu không đúng!' });
    } else if (tutor.status !== 'active') {
      res.render('User/login', { message: 'Tài khoản bị khóa!' });
    } else {
      req.session.name_tutor = tutor.username;
      console.log(req.session.name_tutor);
      req.session.loggedin_tutor = true;
      req.session.email = tutor.email;
      console.log(req.session.email);
      res.redirect('/tutor/home');
    }
  } catch (err) {
    console.error(err);
    res.render('User/login', { message: 'Đã xảy ra lỗi khi đăng nhập.' });
  }
});
router.get('/profile', checkMember, async function (req, res) { //NOSONAR
  try {
    let tutors;
    const usernametutor = req.session.name_tutor;
    const emailtutor = req.session.email;
    if (usernametutor || emailtutor) {
      tutors = await Tutor.findOne({ $or: [{ email: emailtutor }, { username: usernametutor }] })
    };

    //Tìm thông tin 

    const reviews = await Review.findOne({ nametutor: usernametutor });
    const course = await Course.findOne({ nametutor: usernametutor });
    //Định dạng chỉ ngày tháng năm cho birthday
    const birthday = new Date(tutors.birthday);
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedBirthday = birthday.toLocaleDateString('vi-VN', options);
    //render 
    res.render('User/account/index.ejs', {
      tutors,
      reviews,
      course,
      formattedBirthday,
      username: usernametutor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update profile
router.put('/save', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const newEmail = req.body.newEmail;
  const phone = req.body.phonenumber;
  const birthday = new Date(req.body.birthday);
  const address = req.body.address;

  // Kiểm tra xem có email mới không
  if (newEmail) {
    // Tìm kiếm người dùng với địa chỉ email mới
    Tutor.findOne({ email: newEmail })
      .then(existingUser => {
        if (existingUser) {
          // Địa chỉ email mới đã được sử dụng bởi người dùng khác
          res.status(400).json({ message: 'Email address is already in use' });
        } else {
          // Địa chỉ email mới chưa được sử dụng, cập nhật thông tin người dùng
          Tutor.findOneAndUpdate({ email: email }, {
            $set: { name: name, email: newEmail, phonenumber: phone, birthday: birthday, address: address }
          }, { new: true })
            .then(tutor => {
              if (!tutor) {
                res.status(404).json({ message: 'User not found' });
              } else {
                res.json({ message: 'User data updated successfully' });
              }
            })
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      });
  } else {
    // Không có email mới, cập nhật thông tin người dùng bình thường
    Tutor.findOneAndUpdate({ email: email }, {
      $set: { name: name, phonenumber: phone, birthday: birthday, address: address }
    }, { new: true })
      .then(tutor => {
        if (!tutor) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.json({ message: 'User data updated successfully' });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      });
  }
});

//Đăng xuất
router.get('/logout', checkMember, function (req, res) {
  try {
    req.session.loggedin_tutor = false;
    res.render('User/login/index', { message: '' });
  }
  catch (error) {
    res.status(500).json({ message: 'Lỗi' })
  }
});
// avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/avatar/update', upload.single('file'), async (req, res) => { //NOSONAR
  try {
    // Lưu đường dẫn mới vào DB
    const avatarPath = '/avatar/' + req.file.filename;
    const tutor = await Tutor.findOne({ _id: req.body.tutorId });
    const oldAvatarPath = tutor.avt;

    // Xóa ảnh cũ nếu tồn tại
    // Lưu đường dẫn tương đối của thư mục public vào một biến
    const publicDir = 'public';

    // Xóa ảnh cũ nếu tồn tại
    if (oldAvatarPath) {
      const fs = require('fs');
      const filePath = path.join(publicDir, oldAvatarPath);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, function (err) {
          if (err) throw err;
          //console.log('Old avatar deleted!');
        });
      } else {
        // console.log('Avatar file not found!');
      }
    }

    // Lưu ảnh mới vào DB
    await Tutor.findOneAndUpdate({ _id: req.body.tutorId }, { avt: avatarPath });

    res.send('Avatar updated!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//Tạo khóa học
router.post('/new-courses', checkMember, async (req, res) => { //NOSONAR 
  //add khóa học mới
  const { name, category, subject, status, decs } = req.body;
  const nametutor = req.session.name_tutor;
  const key = Math.floor(Math.random() * 9000) + 1000;
  const course = await Course.findOne({ key: key });
  if (course !== null) {
    checkKey(key);
  }
  //tạo thông báo
  const newNotification = new Notification({
    actionName: nametutor,
    category: 'Courses',
    categoryId: key,
  });
  // Tạo một course mới
  const newCourse = new Course({
    name,
    key,
    nametutor,
    category,
    subject,
    status,
    decs
  });

  try {
    // Lưu course mới vào CSDL
    await newNotification.save();
    await newCourse.save();
    console.log("Tên khóa mới ", name, "Mã: ", key);
    // Gửi phản hồi về client
  } catch (error) {
    res.render('User/main/course', { message: 'Tạo khóa học thất bại!', })
    console.log(error);
  }
});
///

//apply
router.post('/apply', async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const tutorName = req.body.tutorName;
    const username = req.session.name_tutor;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).send('Khóa học không tồn tại');
      return;
    }
    // Kiểm tra nếu username đã đăng ký khóa học này, gửi trả về thông báo tương ứng
    if (course.nameuser.includes(username)) {
      res.send({ alreadyApplied: true, username: username });
      return;
    }
    // Kiểm tra nếu tutorName bằng username, không lưu yêu cầu đăng ký vào MongoDB
    if (tutorName === username) {
      res.send({ alreadyApplied: false, username: username });
      return;
    }
    course.nameuser = course.nameuser  + username;
await course.save();
    res.render('User/main/notification.ejs', { course });
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi lưu yêu cầu đăng ký!');
  }
});
// hiển thị trên trang web notification
router.get('/applys', async (req, res) => {
  try {
    const tutorName = req.session.name_tutor;
    const courses = await Course.find({ nametutor: tutorName });
    if (!courses) {
      res.status(404).send('Không tìm thấy khóa học nào');
      return;
    }
    const filteredCourses = courses.filter(course => course.nametutor === tutorName);
    res.render('User/main/notification.ejs', { course: filteredCourses });
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi lấy danh sách yêu cầu đăng ký!');
  }
});
//đồng ý apply
router.post('/accept', async (req, res) => {
  try {
    res.redirect('/tutor/home');
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi cập nhật khóa học!');
  }
});
// huy apply
router.post('/ancel', async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).send('Khóa học không tồn tại');
      return;
    }
    course.nameuser = ''; // remove the user's name from the course
    await course.save();
    res.redirect('/tutor/home');
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi xóa yêu cầu đăng ký!');
  }
});
//Functions
// Function check member
function checkMember(req, res, next) {
  try {
    if (req.session.loggedin_tutor) {
      next();
    } else {
      res.redirect('/tutor/login');
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Lỗi' })
  }
}
//RANDOM KEY
function checkKey(key) {
  const newKey = Math.floor(Math.random() * 9000) + 1000;
  if (newKey === key) {
    return checkKey(key);
  } else {
    return newKey;
  }
}
// Hàm để tạo ra một hash từ password
function generateHash(password) {
  return bcrypt.hashSync(password, saltRounds);
}


module.exports = router; 