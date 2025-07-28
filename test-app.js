const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function testApp() {
  console.log("🧪 Testing Detect CV Application...\n");

  // Test 1: Health check
  console.log("1. Testing server health...");
  try {
    const healthResponse = await axios.get("http://localhost:5001/api/health");
    console.log("✅ Server is running:", healthResponse.data);
  } catch (error) {
    console.log("❌ Server health check failed:", error.message);
    return;
  }

  // Test 2: Create a test PDF-like text file
  console.log("\n2. Creating test file...");
  const testContent = `HỒ SƠ CÁ NHÂN

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
- Tiếng Anh: TOEIC 750`;

  fs.writeFileSync("test-cv.txt", testContent);
  console.log("✅ Test file created");

  // Test 3: Test file upload (simulate)
  console.log("\n3. Testing file processing...");
  try {
    // Create a simple text file to simulate upload
    const formData = new FormData();
    formData.append("file", fs.createReadStream("test-cv.txt"), {
      filename: "test-cv.txt",
      contentType: "text/plain",
    });

    const uploadResponse = await axios.post(
      "http://localhost:5001/api/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
      }
    );

    console.log("✅ File processed successfully");
    console.log("📊 Detected information:");
    console.log("- Name:", uploadResponse.data.data.detectedInfo.name);
    console.log("- Email:", uploadResponse.data.data.detectedInfo.email);
    console.log("- Phone:", uploadResponse.data.data.detectedInfo.phone);
    console.log("- Address:", uploadResponse.data.data.detectedInfo.address);
    console.log(
      "- Education:",
      uploadResponse.data.data.detectedInfo.education
    );
    console.log(
      "- Experience:",
      uploadResponse.data.data.detectedInfo.experience
    );
    console.log("- Skills:", uploadResponse.data.data.detectedInfo.skills);

    // Test 4: Download Excel file
    console.log("\n4. Testing Excel download...");
    const excelResponse = await axios.get(
      `http://localhost:5001/api/download/${uploadResponse.data.data.excelFile}`,
      {
        responseType: "stream",
      }
    );
    console.log("✅ Excel file downloaded successfully");
  } catch (error) {
    console.log(
      "❌ File processing failed:",
      error.response?.data?.error || error.message
    );
  }

  // Cleanup
  console.log("\n5. Cleaning up...");
  if (fs.existsSync("test-cv.txt")) {
    fs.unlinkSync("test-cv.txt");
    console.log("✅ Test file cleaned up");
  }

  console.log("\n🎉 Test completed!");
  console.log("\n📱 You can now access the application at:");
  console.log("   Frontend: http://localhost:3000");
  console.log("   Backend:  http://localhost:5001");
}

testApp().catch(console.error);
