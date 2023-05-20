const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../db/models/admins.js');
const News = require('../db/models/news.js');
const router = express.Router();
//const regex = require('regex');

//News - yêu cầu chuyển hướng
  // Lấy tin tức từ database hiển thị
    router.get('/',checkAdmin, async (req, res) => {
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
    router.get('/edit', checkAdmin ,   function(req, res) {
        try {
        res.render('Admin/news/edit', { username: req.session.username });
        }
        catch (error) {
            res.status(500).json({ message: 'Lỗi' })
        }
    });
    router.get('/add',checkAdmin, async function(req, res) {
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
    router.get('/edit/:id',checkAdmin , async (req, res) => {
        try {
          const id = req.params.id;
          const news = await News.findById(id);
          res.render('Admin/news/edit', { news, username: req.session.username });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
      //Tìm kiếm tin tức
      router.post('/search' ,checkAdmin,  async (req, res) => {
        // Get the search query from req.body
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
//Thao tác db
    //Thêm tin tức bằng post 
    router.post('/add', function (req, res) {
        const { name, content } = req.body;
        const newNews = new News({
        name,
        content,
        });
        newNews.save()
        .then(news => {
            // Lưu thông báo vào session
            res.redirect('/news');
        })
        .catch(err => {
            console.log('Error adding news to database:', err);
            res.redirect('/news/add');
        });
    });
    // Xóa tin tức 
    router.get('/delete/:id', function (req, res) {
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
    router.put('/:id', checkAdmin ,async (req, res) => {
        try {
            const id = req.params.id;
            const updateNews = req.body;
            updateNews.updatedAt = new Date();

            await News.findByIdAndUpdate(
                id, updateNews
            )
            res.redirect('/news');
        }
        catch (error) {
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