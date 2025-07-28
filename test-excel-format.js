const XLSX = require("xlsx");
const fs = require("fs");

// Test data
const testData = {
  name: "Nguyễn Văn An",
  email: "nguyenvanan@gmail.com",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  education: "Đại học Bách Khoa TP.HCM - Công nghệ thông tin",
  experience: "Công ty ABC (2020-2022): Lập trình viên Frontend",
  skills: "JavaScript, React, Node.js, HTML, CSS, Git, Docker",
};

// Function to create Excel file with horizontal headers (same as server)
function createExcelFile(data, filename) {
  const workbook = XLSX.utils.book_new();

  // Create worksheet with horizontal headers
  const wsData = [
    [
      "Tên",
      "Email",
      "Số điện thoại",
      "Địa chỉ",
      "Học vấn",
      "Kinh nghiệm",
      "Kỹ năng",
    ],
    [
      data.name || "Không tìm thấy",
      data.email || "Không tìm thấy",
      data.phone || "Không tìm thấy",
      data.address || "Không tìm thấy",
      data.education || "Không tìm thấy",
      data.experience || "Không tìm thấy",
      data.skills || "Không tìm thấy",
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for better readability
  worksheet["!cols"] = [
    { width: 25 }, // Tên
    { width: 30 }, // Email
    { width: 15 }, // Số điện thoại
    { width: 40 }, // Địa chỉ
    { width: 35 }, // Học vấn
    { width: 40 }, // Kinh nghiệm
    { width: 50 }, // Kỹ năng
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Thông tin CV");

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  const excelPath = `uploads/${filename}`;
  XLSX.writeFile(workbook, excelPath);

  return excelPath;
}

// Test the new format
console.log("🧪 Testing New Excel Format...\n");

console.log("📊 Test Data:");
console.log("- Name:", testData.name);
console.log("- Email:", testData.email);
console.log("- Phone:", testData.phone);
console.log("- Address:", testData.address);
console.log("- Education:", testData.education);
console.log("- Experience:", testData.experience);
console.log("- Skills:", testData.skills);
console.log("");

// Create Excel file
const filename = `test_excel_${Date.now()}.xlsx`;
const excelPath = createExcelFile(testData, filename);

console.log("✅ Excel file created:", excelPath);

// Read and display the Excel content
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("\n📋 Excel Content:");
console.log("Headers:", jsonData[0]);
console.log("Data:", jsonData[1]);

// Check file size
const stats = fs.statSync(excelPath);
console.log(`\n📊 File size: ${stats.size} bytes`);

if (stats.size > 0) {
  console.log("✅ Excel file is valid and not empty");
} else {
  console.log("❌ Excel file is empty");
}

console.log("\n🎉 Excel format test completed!");
console.log("📁 You can open the file at:", excelPath);
