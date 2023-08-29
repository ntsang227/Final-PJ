const express = require('express');
const bodyParser = require('body-parser');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const Notification = require('../../db/models/notification.js');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const Websocket = require('../webserver/websocket.js');


const cloudinary = require('../../db/Cloudinary/cloudinary.js');
const storage = require('../../drivers/Upload/multer-storage.js');

const stripe = require('stripe')('sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m');
var stripePublishableKey = 'pk_test_51NTGMgAD16dsBsnGlXKRXyVAGDO3LjzvW1oL6w3uPryK5OS2t52KOv45rWxlI3YkfcCbZ1x5XEvEfznLvpdgcNDF00cBVAmUy4';
var stripeSecretKey = 'sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m';

const upload = multer({ storage: storage });

//Yêu cầu chuyển hướng
router.get('/', checkMember, function (req, res) {
  if (req.session.loggedin_tutor) {
    res.redirect("/tutor/home");
  } else {
    res.render('User/login/index.ejs', { message: '' });
  }
});

// Chuyển hướng đến trang home tutor 

router.get('/home', checkMember, async (req, res) => {
  try {
    const username = req.cookies.username;
    //const username = localStorage.getItem("username");
    const courses = await Course.find({ status: 'active' }).populate('tutor', 'username');
    const tutors = await Tutor.find({ status: 'active' });
    const notification = await Course.find({})
    res.render('User/main/index.ejs',
      {
        notification,
        courses,
        tutors,
        username,

      });
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.get('/courses', checkMember, function (req, res) {
  res.render('User/main/course.ejs', { email: req.session.email });
});
//Chuyển hướng đến nạp tiền vào ví 
router.get('/payment', checkMember, function (req, res) {
  res.render('User/account/payment.ejs', { email: req.session.email });
});
router.get('/detail-course', checkMember, function (req, res) {
  res.render('User/main/detail-courses.ejs', { email: req.session.email });
});
router.get('/calendar', checkMember, function (req, res) {
  res.render('User/main/calendar.ejs', { email: req.session.email });
});
router.get('/tutors', checkMember, async (req, res) => {
  try {
    const tutors = await Tutor.find({ status: 'active' });
    res.render('User/main/tutors.ejs',
      {
        tutors,
      });
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
});
router.get('/detail-tutors/:id', checkMember, async function (req, res) {
  try {
    const id = req.params.id;
    const tutors = await Tutor.findById(id);
    if (tutors) {
      const reviews = await Review.findOne({ tutor: tutors._id });
      const courses = await Course.findOne({ tutor: tutors._id });

      res.render('User/main/detail-tutors',
        {
          tutors,
          reviews,
          courses,
        });
    } else {
      res.status(404).send('Không tìm thấy tài khoản tutor!');
    }
  }
  catch (error) {
    res.redirect('/tutors/');
  }
});
router.get('/detail-courses/:id', checkMember, async function (req, res) {
  try {
    const id = req.params.id;
    const courses = await Course.findById(id).populate('tutor', 'username');
    const tutors = await Tutor.findOne({ username: courses.tutor.username });
    res.render('User/main/detail-courses',
      {
        courses,
        tutors
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
router.get('/verify', function (req, res) {
  res.render('User/signup/verify/index.ejs', { message: '' });
});

//Chuyển hướng đến login 
router.get('/login', function (req, res) {
  if (req.session.loggedin_tutor) {
    res.redirect("/tutor/home");
  } else {
    res.render('User/login/index.ejs', { message: '' });
  }
});

//Post đăng kí tài khoản

const GOOGLE_MAILER_CLIENT_ID = '971773736385-8s1f6bgqvil3sojgvmikpibkvfed23nc.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04vFtS9Gwf1xNCgYIARAAGAQSNwF-L9IrFyeYlAUfE8LS0QFFZM_BYXmkKEGDFihORi42pHJbcZil571jYIO7t287Ok6FOdp9R70'
const ADMIN_EMAIL_ADDRESS = 'sptutoranytime@gmail.com'

// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/register', async (req, res) => { //NOSONAR
  try {
    const otpCode = generateOTP();

    req.session.otpCode = otpCode;

    const tutorData = new Tutor({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.name_input = tutorData.name;
    req.session.username_input = tutorData.username;
    req.session.email_input = tutorData.email;
    req.session.password_input = tutorData.password;

    const existingUsername = await Tutor.findOne({ username: req.body.username });
    const existingEmail = await Tutor.findOne({ email: req.body.email });

    if (existingEmail) {
      return res.render('User/signup', { message: 'Email đã được đăng ký.' });
    }
    if (existingUsername) {
      return res.render('User/signup', { message: 'Username đã được sử dụng.' });
    }

    const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    const myAccessToken = myAccessTokenObject?.token

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    })
    const mailOptions = {
      to: req.body.email,
      subject: 'Verify your email',
      html: `Your OTP code is <strong>${otpCode}</strong>`
    }

    await transport.sendMail(mailOptions)

    res.render('User/signup/verify', { message: '', otp: otpCode });


  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

//Verify OTP code

router.post('/verify', async (req, res) => {

  const enteredOTP = req.body.otp;
  const savedOTP = req.session.otpCode;

  const nameinput = req.session.name_input;
  const usernameinput = req.session.username_input;
  const emailinput = req.session.email_input;
  const passwordinput = req.session.password_input;
  const hashedPassword = generateHash(passwordinput);

  if (enteredOTP === savedOTP) {
    try {
      const tutor = new Tutor({
        name: nameinput,
        username: usernameinput,
        email: emailinput,
        password: hashedPassword,
      });
      await tutor.save();

      const newNotification = new Notification({
        name: 'Người dùng mới',
        category: 'newUser',
        actionName: usernameinput
      });
      await newNotification.save();

      // Delete session
      delete req.session.name_input;
      delete req.session.username_input;
      delete req.session.email_input;
      delete req.session.password_input;

      res.redirect('/tutor/login');

    } catch (error) {
      console.error(error);
    }
  } else {
    res.render('User/signup/verify', { message: 'Invalid OTP code.', otp: savedOTP });
  }
});

//Post login 

router.post('/login', async function (req, res) { //NOSONAR 
  console.log('login')
  const username = req.body.login;
  const email = req.body.login;
  const password = req.body.password;
  try {
    const tutor = await Tutor.findOne({ $or: [{ email: email }, { username: username }] });
    const isMatch = bcrypt.compareSync(password, tutor.password);
    console.log(isMatch);
    console.log(password);
    console.log(tutor.password);
    if (!tutor) {
      res.render('User/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    } else if (!isMatch) {
      res.render('User/login', { message: 'Mật khẩu không đúng!' });
    } else if (tutor.status !== 'active') {
      res.render('User/login', { message: 'Tài khoản bị khóa!' });
    } else {
      req.session.id_tutor = tutor._id;
      req.session.name_tutor = tutor.username;
      console.log(req.session.name_tutor);
      req.session.loggedin_tutor = true;
      req.session.email = tutor.email;
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
    //const course = await Course.findOne({ nametutor: usernametutor });
    const course = await Course.find({});
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


router.post('/avatar/update', upload.single('file'), async (req, res) => { //NOSONAR
  try {
    // Tải lên ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Lưu URL mới vào DB
    const avatarUrl = result.secure_url;
    const tutor = await Tutor.findOne({ _id: req.body.tutorId });
    const oldAvatarUrl = tutor.avt;

    // Xóa ảnh cũ nếu tồn tại
    if (oldAvatarUrl) {
      await cloudinary.uploader.destroy(oldAvatarUrl);
    }

    // Lưu URL mới vào DB
    await Tutor.updateOne({ _id: req.body.tutorId }, { avt: avatarUrl });

    // Xóa file tạm thời trên server
    fs.unlinkSync(req.file.path);

    res.send('OK!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//Tạo khóa học
router.post('/new-courses', checkMember, async (req, res) => { //NOSONAR
  const { name, category, subject, status, decs } = req.body;
  const tutorId = req.session.id_tutor;
  const key = Math.floor(Math.random() * 9000) + 1000;
  const course = await Course.findOne({ key: key });

  if (course !== null) {
    checkKey(key);
  }

  const newNotification = new Notification({
    actionName: req.session.name_tutor,
    category: 'Courses',
    categoryId: key,
  });

  const newCourse = new Course({
    name,
    key,
    tutor: tutorId,
    category,
    subject,
    status,
    decs
  });

  try {
    await newNotification.save();
    await newCourse.save();
    console.log("Tên khóa mới ", name, "Mã: ", key);
  } catch (error) {
    res.render('User/main/course', { message: 'Tạo khóa học thất bại!', })
    console.log(error);
  }
});


//apply
router.post('/apply', async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const tutorName = req.body.tutorName;
    const username = req.session.name_tutor;
    const notification = await Course.find({})
    const user = await Tutor.findOne({ username: username });
    const userId = user._id;
    const courses = await Course.findById(courseId);
    if (!courses) {
      res.status(404).send('Khóa học không tồn tại');
      return;
    }
    // Kiểm tra nếu tutorName bằng username, không lưu yêu cầu đăng ký vào MongoDB
    if (tutorName === username) {
      res.send({ alreadyApplied: false, username: username });
      return;
    }
    courses.student = userId;
    await courses.save();
    res.render('User/main/index.ejs', { courses, notification: notification, });
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi lưu yêu cầu đăng ký!');
  }
});
// hiển thị trên trang web notification
router.get('/applys', async (req, res) => {
  try {
    const courses = await Course.find({}).populate('tutor', 'username').populate('student','username' );
    const tutors = await Tutor.find({ status: 'active' });
    const notification = await Course.find({}).populate('tutor', 'username').populate('student','username' );
    const status = await Notification.find({});
    const tutorName = req.body.tutorName;
    const username = req.cookies.username;
    if (!courses) {
      res.status(404).send('Không tìm thấy khóa học nào');
      return;
    }
    await Notification.updateMany({ $and: [{ status: 'Chưa xem' }, { actionName: tutorName }] }, { $set: { status: 'Đã xem' } });
    res.render('User/main/apply-modal.ejs', {
      status,
      notification,
      username,
      tutors,
      courses,
      isPoster: true // biến cờ để kiểm tra xem người dùng hiện tại có phải là người đăng bài hay không
    });

  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi lấy danh sách yêu cầu đăng ký!');
  }
});
// đồng ý apply
router.post('/accept', async (req, res) => {
  const courseId = req.body.courseId;
  try {
    const notification = await Course.find({}).populate('tutor', 'username').populate('student','username');
    
    Course.findById(courseId)
      .then((course) => {
        if (course) {
          const username = course.student;
          const matchedNotification = notification.find((item) => item.student._id.toString() === course.student.toString());
          
          if (matchedNotification) {
            const notificationUsername = matchedNotification.student.username;

            Course.findOneAndUpdate(
              { student: username },
              { status: 'inactive' },
              { new: true }
            )
              .then((updatedCourse) => {
                if (updatedCourse) {
                  // Gửi thông báo đến notificationUsername
                  console.log(`Đã gửi thông báo đến ${notificationUsername}`);

                  // Emit a 'request-accepted' event to the WebSocket server
                  Websocket.getInstance().io.emit('request-accepted', {
                    username: notificationUsername,
                    courseId: courseId,
                  });

                  // hiển thị thông báo thành công và cập nhật trang EJS
                  res.render('User/main/apply-modal.ejs', {
                    courses: updatedCourse,
                    notification: notification,
                    isPoster: false, // người dùng hiện tại không phải là người đăng bài
                    username: notificationUsername,
                  });
                } else {
                  console.log(`Không tìm thấy người dùng với username: ${notificationUsername}`);
                  res.send('Có lỗi xảy ra');
                }
              })
              .catch((err) => {
                console.log(err);
                res.send('Có lỗi xảy ra');
              });
          } else {
            console.log(`Không tìm thấy thông báo cho người dùng với ID: ${course.student}`);
            res.send('Có lỗi xảy ra');
          }
        } else {
          console.log(`Không tìm thấy khóa học với ID: ${courseId}`);
          res.send('Có lỗi xảy ra');
        }
      })
      .catch((err) => {
        console.log(err);
        res.send('Có lỗi xảy ra');
      });
  } catch (err) {
    console.log(err);
    res.send('Có lỗi xảy ra');
  }
});

// huy apply
router.post('/ancel', async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const notification = await Course.find({})
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).send('Khóa học không tồn tại');
      return;
    }
    course.student = ''; // remove the user's name from the course
    await course.save();
    res.redirect('/tutor/home');
  } catch (err) {
    console.log(err);
    res.status(500).send('Đã xảy ra lỗi khi xóa yêu cầu đăng ký!');
  }
});
//search 
router.post('/search', checkMember, async (req, res) => { //NOSONAR
  let { grade, subject } = req.body;
  let query = req.body.query.trim();
  let courses;
  const status = 'active';
  console.log({ status, grade, subject, query });
  try {
    if (query) {
      courses = await Course.find({
        status,
        category: new RegExp('.*' + grade + '.*', 'i'),
        subject: new RegExp('.*' + subject + '.*', 'i'),
        $or: [
          { name: new RegExp('.*' + query + '.*', 'i') },
          { decs: new RegExp('.*' + query + '.*', 'i') },
          { key: new RegExp('.*' + query + '.*', 'i') },
          { nametutor: new RegExp('.*' + query + '.*', 'i') }
        ]
      });
    } else if (grade) {
      courses = await Course.find({
        status,
        category: new RegExp('.*' + grade + '.*', 'i'),
        $or: [
          { subject: new RegExp('.*' + subject + '.*', 'i') }
        ]
      });
    } else {
      courses = await Course.find({
        status
      }
      );
    }
    console.log(courses);
    res.render('User/main/index',
      {
        courses,
      });
  } catch (err) {
    res.status(500).json({ message: error.message })
  }
});

// get search 
router.get('/search-grade', checkMember, async (req, res) => {
  try {
    const selectedCategory = req.query.category;
    const courses = await Course.find({ category: selectedCategory, status: 'active' }).populate('tutor', 'username');
    const tutors = await Tutor.find({ status: 'active' });

    res.render('User/main/index.ejs', {
      courses,
      tutors
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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