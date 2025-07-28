const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function testDownload() {
  console.log("🧪 Testing Download Functionality...\n");

  // Test 1: Health check
  console.log("1. Testing server health...");
  try {
    const healthResponse = await axios.get("http://localhost:5001/api/health");
    console.log("✅ Server is running:", healthResponse.data);
  } catch (error) {
    console.log("❌ Server health check failed:", error.message);
    return;
  }

  // Test 2: Create a test Excel file manually
  console.log("\n2. Creating test Excel file...");
  const XLSX = require("xlsx");

  const workbook = XLSX.utils.book_new();
  const wsData = [
    ["Test", "Value"],
    ["Name", "Nguyễn Văn An"],
    ["Email", "test@example.com"],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Test");

  const testFilename = `test_excel_${Date.now()}.xlsx`;
  const testFilePath = `uploads/${testFilename}`;

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  XLSX.writeFile(workbook, testFilePath);
  console.log("✅ Test Excel file created:", testFilename);

  // Test 3: Test download
  console.log("\n3. Testing download...");
  try {
    const downloadResponse = await axios.get(
      `http://localhost:5001/api/download/${testFilename}`,
      {
        responseType: "stream",
      }
    );

    console.log("✅ Download successful");
    console.log("📊 Response headers:", downloadResponse.headers);

    // Save the downloaded file
    const writer = fs.createWriteStream(`downloaded_${testFilename}`);
    downloadResponse.data.pipe(writer);

    writer.on("finish", () => {
      console.log("✅ File downloaded and saved successfully");
    });

    writer.on("error", (err) => {
      console.log("❌ Error saving downloaded file:", err.message);
    });
  } catch (error) {
    console.log("❌ Download failed:", error.response?.data || error.message);
  }

  // Test 4: Test non-existent file
  console.log("\n4. Testing download of non-existent file...");
  try {
    await axios.get("http://localhost:5001/api/download/nonexistent.xlsx");
    console.log("❌ Should have failed but succeeded");
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("✅ Correctly returned 404 for non-existent file");
    } else {
      console.log(
        "❌ Unexpected error:",
        error.response?.data || error.message
      );
    }
  }

  // Cleanup
  console.log("\n5. Cleaning up...");
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log("✅ Test file cleaned up");
  }

  console.log("\n🎉 Download test completed!");
}

testDownload().catch(console.error);
