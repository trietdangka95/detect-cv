const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function testFullFlow() {
  console.log("🧪 Testing Full Flow: Upload → Process → Download...\n");

  // Test 1: Health check
  console.log("1. Testing server health...");
  try {
    const healthResponse = await axios.get("http://localhost:5001/api/health");
    console.log("✅ Server is running:", healthResponse.data);
  } catch (error) {
    console.log("❌ Server health check failed:", error.message);
    return;
  }

  // Test 2: Upload PDF file
  console.log("\n2. Testing PDF upload and processing...");
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream("demo-cv.pdf"), {
      filename: "demo-cv.pdf",
      contentType: "application/pdf",
    });

    const uploadResponse = await axios.post(
      "http://localhost:5001/api/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    console.log("✅ File uploaded and processed successfully");
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
    console.log("- Excel file:", uploadResponse.data.data.excelFile);

    // Test 3: Download Excel file
    console.log("\n3. Testing Excel download...");
    const excelFilename = uploadResponse.data.data.excelFile;

    const downloadResponse = await axios.get(
      `http://localhost:5001/api/download/${excelFilename}`,
      {
        responseType: "stream",
        timeout: 30000,
      }
    );

    console.log("✅ Excel file downloaded successfully");
    console.log("📊 Download headers:", downloadResponse.headers);

    // Save the downloaded file
    const downloadedFilename = `downloaded_${excelFilename}`;
    const writer = fs.createWriteStream(downloadedFilename);
    downloadResponse.data.pipe(writer);

    writer.on("finish", () => {
      console.log(`✅ File saved as: ${downloadedFilename}`);

      // Check file size
      const stats = fs.statSync(downloadedFilename);
      console.log(`📊 File size: ${stats.size} bytes`);

      if (stats.size > 0) {
        console.log("✅ File is not empty - download successful!");
      } else {
        console.log("❌ File is empty - download may have failed");
      }
    });

    writer.on("error", (err) => {
      console.log("❌ Error saving downloaded file:", err.message);
    });
  } catch (error) {
    console.log(
      "❌ Full flow test failed:",
      error.response?.data?.error || error.message
    );

    if (error.response?.status) {
      console.log("📊 Response status:", error.response.status);
    }
  }

  console.log("\n🎉 Full flow test completed!");
  console.log("\n📱 You can now test the web interface at:");
  console.log("   http://localhost:3000");
}

testFullFlow().catch(console.error);
