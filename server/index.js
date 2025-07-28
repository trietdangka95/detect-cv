const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");
const sharp = require("sharp");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ file PDF và hình ảnh (JPEG, PNG)"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error("Không thể đọc file PDF: " + error.message);
  }
}

// Function to extract text from image using OCR
async function extractTextFromImage(filePath) {
  try {
    // Optimize image for better OCR
    const optimizedPath = filePath.replace(/\.[^/.]+$/, "_optimized.jpg");

    await sharp(filePath)
      .resize(2000, null, { withoutEnlargement: true })
      .sharpen()
      .jpeg({ quality: 90 })
      .toFile(optimizedPath);

    const result = await Tesseract.recognize(optimizedPath, "vie+eng", {
      logger: (m) => console.log(m),
    });

    // Clean up optimized image
    fs.removeSync(optimizedPath);

    return result.data.text;
  } catch (error) {
    throw new Error("Không thể đọc hình ảnh: " + error.message);
  }
}

// Function to detect information from text
function detectInformation(text) {
  const info = {
    name: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
    rawText: text,
  };

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails) {
    info.email = emails[0];
  }

  // Extract phone numbers (Vietnamese format)
  const phoneRegex = /(\+84|84|0)[0-9]{9,10}/g;
  const phones = text.match(phoneRegex);
  if (phones) {
    info.phone = phones[0];
  }

  // Enhanced name detection for both English and Vietnamese
  const namePatterns = [
    // Vietnamese patterns
    /(?:họ\s+tên|tên|họ\s+và\s+tên|họ\s+tên\s+đầy\s+đủ)[\s:]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)/i,
    // English patterns
    /(?:name|full\s+name|first\s+name|last\s+name)[\s:]+([A-Z][a-z\s]+)/i,
    // General pattern for capitalized names
    /([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)(?=\n|$)/m,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      info.name = match[1].trim();
      break;
    }
  }

  // Extract address
  const addressPatterns = [
    /(?:địa\s+chỉ|address|đc|địa\s+chỉ\s+liên\s+lạc)[\s:]+([^.\n]+)/i,
    /(?:sống\s+tại|residing\s+at|current\s+address)[\s:]+([^.\n]+)/i,
  ];

  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      info.address = match[1].trim();
      break;
    }
  }

  // Extract education
  const educationPatterns = [
    /(?:học\s+vấn|education|trình\s+độ|bằng\s+cấp)[\s:]+([^.\n]+)/i,
    /(?:tốt\s+nghiệp|graduated|degree)[\s:]+([^.\n]+)/i,
  ];

  for (const pattern of educationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      info.education = match[1].trim();
      break;
    }
  }

  // Extract experience
  const experiencePatterns = [
    /(?:kinh\s+nghiệm|experience|work\s+experience|làm\s+việc)[\s:]+([^.\n]+)/i,
    /(?:employment|job\s+history)[\s:]+([^.\n]+)/i,
  ];

  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      info.experience = match[1].trim();
      break;
    }
  }

  // Extract skills
  const skillsPatterns = [
    /(?:kỹ\s+năng|skills|technical\s+skills|công\s+nghệ)[\s:]+([^.\n]+)/i,
    /(?:technologies|programming\s+languages)[\s:]+([^.\n]+)/i,
  ];

  for (const pattern of skillsPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      info.skills = match[1].trim();
      break;
    }
  }

  return info;
}

// Function to create Excel file with horizontal headers
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

  // Fix the path to match the download path
  const excelPath = path.join(__dirname, "..", "uploads", filename);
  XLSX.writeFile(workbook, excelPath);

  return excelPath;
}

// API Routes
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được upload" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = "";

    // Extract text based on file type
    if (fileType === "application/pdf") {
      extractedText = await extractTextFromPDF(filePath);
    } else if (fileType.startsWith("image/")) {
      extractedText = await extractTextFromImage(filePath);
    }

    // Detect information from extracted text
    const detectedInfo = detectInformation(extractedText);

    // Create Excel file
    const excelFilename = `cv_data_${Date.now()}.xlsx`;
    const excelPath = createExcelFile(detectedInfo, excelFilename);

    res.json({
      success: true,
      message: "Xử lý file thành công",
      data: {
        originalFile: req.file.filename,
        excelFile: excelFilename,
        detectedInfo: detectedInfo,
      },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      error: "Lỗi xử lý file: " + error.message,
    });
  }
});

app.get("/api/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);

  console.log("Download request for:", filename);
  console.log("File path:", filePath);

  if (fs.existsSync(filePath)) {
    console.log("File exists, downloading...");
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "Lỗi khi tải file: " + err.message });
      }
    });
  } else {
    console.log("File not found:", filePath);
    res.status(404).json({
      error: "File không tồn tại",
      filename: filename,
      path: filePath,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server đang hoạt động" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File quá lớn. Giới hạn 10MB" });
    }
  }

  console.error("Server error:", error);
  res.status(500).json({ error: "Lỗi server: " + error.message });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
