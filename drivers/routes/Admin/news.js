const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const News = require('../../../db/models/news.js');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
    router.get('/news/',checkAdmin, async (req, res) => {
            try {
                const news = await News.find();
                //console.log(JSON.stringify(news)) 
                res.render('Admin/news/index.ejs', 
                {
                    news ,
                    username: req.session.username,
                    });
            }
            catch (error) {
                res.status(500).json({ message: error.message })
            }
        })
        // Chuyển hướng  đến edit 
    router.get('/news/edit', checkAdmin ,   function(req, res) {
        try {
        res.render('Admin/news/edit', { username: req.session.username });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    });
    // Chuyển hướng đến add 
    router.get('/news/add',checkAdmin, async function(req, res) {
        try {
            const news = await News.find();
                res.render('Admin/news/add', 
                {
                    news ,
                    username: req.session.username,
                    });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    }); 
    // Chuyển hướng đến details news
    router.get('/news/details/:id',checkAdmin, async function(req, res) {
        try {
            const id = req.params.id;
            const news = await News.findById(id);
                res.render('Admin/news/details', 
                {
                    news ,
                    username: req.session.username,
                    });
        }
        catch (error) {
            res.redirect('/news/');
        }
    }); 
//Thao tác data
    //Thêm tin tức bằng post 
            //cách cũ không post hình
                // router.post('/add', function (req, res) {
                //     const { name, content } = req.body;
                //     const newNews = new News({
                //     name,
                //     content,
                //     });
                //     newNews.save()
                //     .then(news => {
                //         // Lưu thông báo vào session
                //         res.redirect('/news');
                //     })
                //     .catch(err => {
                //         console.log('Error adding news to database:', err);
                //         res.redirect('/news/add');
                //     });
                // });
            //cách mới post được hình
    router.post('/news/add', upload.single('image'), function (req, res) {
        const { name, content } = req.body;
        const newNews = new News({
            name,
            content,
            image: `/images/${req.file.filename}`
        });
        newNews.save()
        res.render('Admin/news/add',
            {
                message: 'Thêm thành công',
                username: req.session.username 
            });

    });
    // edit theo id news 
    router.get('/news/edit/:id',checkAdmin , async (req, res) => {
        try {
          const id = req.params.id;
          const news = await News.findById(id);
          res.render('Admin/news/edit', { news, username: req.session.username });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
    // Xóa tin tức 
    router.get('/news/delete/:id', function (req, res) {
        News.findOneAndDelete({ _id: req.params.id })
        .then(data => {
            if (!data) {
            console.log('Không tìm thấy bản tin');
            return res.redirect('/news');
            }
            return res.redirect('/news');
        })
        .catch(err => {
            console.log('Error deleting item from database:', err);
            console.log('Lỗi khi xoá bản tin');
            return res.redirect('/news');
        });
    });
    // Sửa tin tức

    router.put('/news/:id', checkAdmin, upload.single('image'), async (req, res) => { //NOSONAR
        try {
            const { name, content } = req.body;
            const id = req.params.id;
            const news = await News.findById(id);
            const oldImagePath = news.image;
            console.log(oldImagePath);
            news.updatedAt = new Date();
            news.name = name;
            news.content = content;
    
            if (req.file) {
                news.image = `/images/${req.file.filename}`;
    
                // Kiểm tra file cũ tồn tại trước khi xóa
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
    
            await news.save();
    
            res.render('Admin/news/edit', { news, username: req.session.username, message: 'Sửa thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    //Tìm kiếm tin tức
    router.post('/news/search' ,checkAdmin,  async (req, res) => {
        const query = req.body.query;
        try {
            const news = await News.find({
                $or: [
                  { name: new RegExp('.*' + query + '.*', 'i') },
                  { content: new RegExp('.*' + query + '.*', 'i') }
                ]
              });
          res.render('Admin/news/index.ejs', 
                {
                    news ,
                    username: req.session.username,
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