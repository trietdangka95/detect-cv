const fs = require("fs");
const PDFDocument = require("pdfkit");

// Create a PDF document
const doc = new PDFDocument();

// Pipe its output to a file
doc.pipe(fs.createWriteStream("demo-cv.pdf"));

// Add content to the PDF
doc.fontSize(20).text("HỒ SƠ CÁ NHÂN", { align: "center" });
doc.moveDown();

doc.fontSize(14).text("Họ tên: Nguyễn Văn An");
doc.fontSize(12).text("Email: nguyenvanan@gmail.com");
doc.fontSize(12).text("Số điện thoại: 0901234567");
doc.fontSize(12).text("Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM");
doc.moveDown();

doc.fontSize(16).text("HỌC VẤN");
doc.fontSize(12).text("- Đại học Bách Khoa TP.HCM");
doc.fontSize(12).text("- Chuyên ngành: Công nghệ thông tin");
doc.fontSize(12).text("- Tốt nghiệp: 2020");
doc.moveDown();

doc.fontSize(16).text("KINH NGHIỆM LÀM VIỆC");
doc.fontSize(12).text("- Công ty ABC (2020-2022): Lập trình viên Frontend");
doc.fontSize(12).text("- Công ty XYZ (2022-nay): Senior Developer");
doc.moveDown();

doc.fontSize(16).text("KỸ NĂNG");
doc.fontSize(12).text("- JavaScript, React, Node.js");
doc.fontSize(12).text("- HTML, CSS, Bootstrap");
doc.fontSize(12).text("- Git, Docker, AWS");
doc.fontSize(12).text("- Tiếng Anh: TOEIC 750");
doc.moveDown();

doc.fontSize(16).text("MỤC TIÊU");
doc
  .fontSize(12)
  .text(
    "Trở thành một Full-stack Developer chuyên nghiệp và đóng góp vào các dự án công nghệ tiên tiến."
  );

// Finalize the PDF
doc.end();

console.log("✅ Demo PDF created: demo-cv.pdf");
console.log("📄 You can now upload this file to test the application");
