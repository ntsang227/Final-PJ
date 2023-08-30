const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const News = require('../../../db/models/news.js');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const cloudinary = require('../../../db/Cloudinary/cloudinary.js');
const storage = require('../../../drivers/Upload/multer-storage.js');

const upload = multer({ storage: storage });


//News - yêu cầu chuyển hướng
  // Chuyển hướng đến trang chủ 
    router.get('/news/',checkAdmin, async (req, res) => { //NOSONAR 
            try {
                const news = await News.find();
                //console.log(JSON.stringify(news)) 
                res.render('Admin/news/index.ejs', 
                {
                    news ,
                    username: req.session.username,
                    author: req.session.author,
                    });
            }
            catch (error) {
                res.status(500).json({ message: error.message })
            }
        })
        // Chuyển hướng  đến edit 
    router.get('/news/edit', checkAdmin ,   function(req, res) {
        try {
        res.render('Admin/news/edit', { username: req.session.username , author: req.session.author,});
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    });
    // Chuyển hướng đến add 
    router.get('/news/add',checkAdmin, async function(req, res) { //NOSONAR
        try {
            const news = await News.find();
                res.render('Admin/news/add', 
                {
                    news ,
                    username: req.session.username,
                    author: req.session.author,
                    });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    }); 
    // Chuyển hướng đến details news
    router.get('/news/details/:id',checkAdmin, async function(req, res) { //NOSONAR 
        try {
            const id = req.params.id;
            const news = await News.findById(id);
                res.render('Admin/news/details', 
                {
                    news ,
                    username: req.session.username,
                    author: req.session.author,
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
    router.post('/news/add', checkAdmin, upload.single('image'), async function (req, res) { //NOSONAR
        const { name, content, url } = req.body;

        try {
            // Upload ảnh lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            const imageUrl = result.secure_url;

            // Tạo một bài viết mới với thông tin ảnh từ Cloudinary
            const newNews = new News({
            name,
            content,
            image: imageUrl,
            sourceUrl : url
            });
            await newNews.save();

            res.render('Admin/news/add', {
            message: 'Tạo tin tức thành công!',
            username: req.session.username,
            author: req.session.author,
            });
        } catch (error) {
            console.error(error);
            res.render('Admin/news/add', {
            message: 'Có lỗi xảy ra khi thêm bài viết!',
            username: req.session.username,
            author: req.session.author,
            });
        }
        });
    // edit theo id news 
    router.get('/news/edit/:id',checkAdmin , async (req, res) => { //NOSONAR
        try {
          const id = req.params.id;
          const news = await News.findById(id);
          res.render('Admin/news/edit', { news, username: req.session.username, author: req.session.author, });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
    // Xóa tin tức 
    router.get('/news/delete/:id',checkAdmin, function (req, res) {
        News.findOneAndDelete({ _id: req.params.id })
        .then(data => {
            if (!data) {
            console.log('Không tìm thấy bản tin');
            return res.redirect('/admin/news');
            }
            return res.redirect('/admin/news');
        })
        .catch(err => {
            console.log('Error deleting item from database:', err);
            console.log('Lỗi khi xoá bản tin');
            return res.redirect('/admin/news');
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
                const result = await cloudinary.uploader.upload(req.file.path);
                news.image = result.secure_url;
    
                // Kiểm tra file cũ tồn tại trên Cloudinary trước khi xóa
                if (oldImagePath && oldImagePath.includes('cloudinary')) {
                    const publicId = cloudinary.url(oldImagePath).split('/')[4].split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                console.log(result.secure_url);
            }
            await news.save();
    
            res.render('Admin/news/edit', { news, username: req.session.username, author: req.session.author, message: 'Sửa thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    //ẩn tin tức khỏi trang chủ
    router.post('/news/hidden/:id', checkAdmin, async (req, res) => { //NOSONAR
        try {
            const id = req.params.id;
            console.log(req.params.id);
            const news = await News.findById(id);
            news.updatedAt = new Date();
            news.status = 'inactive';
            await news.save();
            res.json({ message: 'Thao tác thành công' });
            console.log("1");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    //hiển thị lại tin tức
    router.post('/news/show/:id', checkAdmin, async (req, res) => { //NOSONAR
        try {
            const id = req.params.id;
            console.log(req.params.id);
            const news = await News.findById(id);
            news.updatedAt = new Date();
            news.status = 'active';
            await news.save();
            console.log("2");
            res.json({ message: 'Thao tác thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    //Tìm kiếm tin tức
    router.get('/news/search' ,checkAdmin,  async (req, res) => { //NOSONAR
        const query = req.query.query.trim();
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
                    author: req.session.author,
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