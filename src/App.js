const http = require('http');
const fs = require('fs');

// Đọc nội dung file html
const homePage = fs.readFileSync('src/index.html');

// Tạo server và render file html khi client request
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(homePage);
    res.end();
  }
});

// Chạy server tại cổng 3000
server.listen(3000, () => {
  console.log('Server is running at port 3000');
});
// Đọc nội dung file html
const homePage2 = fs.readFileSync('src/Admin/index.html');

// Tạo server và render file html khi client request
const server2 = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(homePage);
    res.end();
  }
});

// Chạy server tại cổng 3000
server2.listen(8000, () => {
  console.log('Admin client is running at port 8000');
});
  