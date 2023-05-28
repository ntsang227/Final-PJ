const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const Course = require('../../../db/models/course.js');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


//News - yêu cầu chuyển hướng
  // Chuyển hướng đến trang chủ 
    router.get('/course/',checkAdmin, async (req, res) => {
            try {
                const courses = await Course.find();
                //console.log(JSON.stringify(news)) 
                res.render('Admin/course/index.ejs', 
                {
                    courses,
                    username: req.session.username,
                    });
            }
            catch (error) {
                res.status(500).json({ message: error.message })
            }
        })
        // Chuyển hướng  đến edit 
    router.get('/course/edit', checkAdmin ,   function(req, res) {
        try {
        res.render('Admin/course/edit', { username: req.session.username });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    });
    // Chuyển hướng đến add 
    router.get('/course/add',checkAdmin, async function(req, res) {
        try {
            const course = await Course.find();
                res.render('Admin/course/add', 
                {
                    course ,
                    username: req.session.username,
                    });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    }); 
    // Chuyển hướng đến details news
    router.get('/course/details.html/:id',checkAdmin, async function(req, res) {
        try {
            const id = req.params.id;
            const courses = await Course.findById(id);
                res.render('Admin/course/details', 
                {
                    courses  ,
                    username: req.session.username,
                    });
        }
        catch (error) {
            res.redirect('/course/');
        }
    }); 
//Thao tác db
    //Thêm khóa học
    router.post('/course/add', upload.single('image'), function (req, res) {
        const { name, nametutor,nameuser,key, status , content } = req.body;
        const newCourse = new Course({
            name,
            nametutor,
            nameuser,
            key,
            status,
            content,
        });
        newCourse.save()
        .then(course => {
            res.render('Admin/course/add ',
            {
                message: 'Thêm thành công',
                username: req.session.username 
            })

        })
        .catch(err => {
            console.log('Error adding course to database:', err);
            res.redirect('/course/add');
        });
    });
    // Sửa theo id
    router.get('/course/edit/:id',checkAdmin , async (req, res) => {
        try {
          const id = req.params.id;
          const courses = await Course.findById(id);
          res.render('Admin/course/edit', { courses, username: req.session.username });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
    // Xóa tin tức 
    router.get('/course/delete/:id',  async (req, res) => {
        Course.findOneAndDelete({ _id: req.params.id })
        .then(data => {
            if (!data) {
            res.render('Admin/course/index', { username: req.session.username ,message: 'Xóa không thành công'})
            }
            return res.redirect('/course')
        })
        .catch(err => {
            console.log('Error deleting item from database:', err);
            console.log('Lỗi khi xóa khóa học');
            return res.redirect('/course');
        });
    });
    // Sửa tin tức
    router.put('/course/:id', checkAdmin ,async (req, res) => {
        try {
            const id = req.params.id;
            const updateCourse = req.body;
            updateCourse.updatedAt = new Date();
            const courses = await Course.findById(id);
            await Course.findByIdAndUpdate(
                id, updateCourse
            )
            res.render('Admin/course/edit', {courses,username: req.session.username ,message: 'Sửa thành công'})
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    });
    //Tìm kiếm tin tức
    router.post('/course/search' ,checkAdmin,  async (req, res) => {
        let query = req.body.query.trim()
        try {
            const courses = await Course.find({
                $or: [
                  { name: new RegExp('.*' + query + '.*', 'i') },
                  { content: new RegExp('.*' + query + '.*', 'i') },
                  { key: new RegExp('.*' + query + '.*', 'i') },
                  { nametutor: new RegExp('.*' + query + '.*', 'i') },
                  { nameuser: new RegExp('.*' + query + '.*', 'i') },
                  { content: new RegExp('.*' + query + '.*', 'i') },
                  { status: new RegExp('.*' + query + '.*', 'i') }
                ]
              });
          res.render('Admin/course/index', 
                {
                    courses ,
                    username: req.session.username,
                    message : 'Không tìm thấy thông tin',
                    });
        } catch (err) {
            res.status(500).json({ message: error.message })
        }
      });


//Functions
    // CheckAdmin function
    function checkAdmin(req, res, next){
        try {
        if (req.session.loggedin) {
            next();  
        } else {
            res.redirect('/admin');
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
        }
    }

module.exports = router;