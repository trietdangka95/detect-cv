const fs = require("fs");

// Create a simple text file that looks like a CV
const cvContent = `HỒ SƠ CÁ NHÂN

Họ tên: Nguyễn Văn An
Email: nguyenvanan@gmail.com
Số điện thoại: 0901234567
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM

HỌC VẤN
- Đại học Bách Khoa TP.HCM
- Chuyên ngành: Công nghệ thông tin
- Tốt nghiệp: 2020

KINH NGHIỆM LÀM VIỆC
- Công ty ABC (2020-2022): Lập trình viên Frontend
- Công ty XYZ (2022-nay): Senior Developer

KỸ NĂNG
- JavaScript, React, Node.js
- HTML, CSS, Bootstrap
- Git, Docker, AWS
- Tiếng Anh: TOEIC 750

MỤC TIÊU
Trở thành một Full-stack Developer chuyên nghiệp và đóng góp vào các dự án công nghệ tiên tiến.`;

// Write to a text file first
fs.writeFileSync("demo-cv.txt", cvContent);

// Now create a simple HTML file that can be converted to PDF
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CV Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; text-align: center; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; }
        .info { margin: 10px 0; }
        .section { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>HỒ SƠ CÁ NHÂN</h1>
    
    <div class="section">
        <div class="info"><strong>Họ tên:</strong> Nguyễn Văn An</div>
        <div class="info"><strong>Email:</strong> nguyenvanan@gmail.com</div>
        <div class="info"><strong>Số điện thoại:</strong> 0901234567</div>
        <div class="info"><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</div>
    </div>
    
    <div class="section">
        <h2>HỌC VẤN</h2>
        <div class="info">- Đại học Bách Khoa TP.HCM</div>
        <div class="info">- Chuyên ngành: Công nghệ thông tin</div>
        <div class="info">- Tốt nghiệp: 2020</div>
    </div>
    
    <div class="section">
        <h2>KINH NGHIỆM LÀM VIỆC</h2>
        <div class="info">- Công ty ABC (2020-2022): Lập trình viên Frontend</div>
        <div class="info">- Công ty XYZ (2022-nay): Senior Developer</div>
    </div>
    
    <div class="section">
        <h2>KỸ NĂNG</h2>
        <div class="info">- JavaScript, React, Node.js</div>
        <div class="info">- HTML, CSS, Bootstrap</div>
        <div class="info">- Git, Docker, AWS</div>
        <div class="info">- Tiếng Anh: TOEIC 750</div>
    </div>
    
    <div class="section">
        <h2>MỤC TIÊU</h2>
        <div class="info">Trở thành một Full-stack Developer chuyên nghiệp và đóng góp vào các dự án công nghệ tiên tiến.</div>
    </div>
</body>
</html>`;

fs.writeFileSync("demo-cv.html", htmlContent);

console.log("✅ Created demo files:");
console.log("   - demo-cv.txt (text file)");
console.log("   - demo-cv.html (HTML file)");
console.log("");
console.log(
  "📝 Note: For testing, you can use the HTML file or create a PDF manually from the HTML file."
);
console.log("   You can also test with any existing PDF file you have.");
