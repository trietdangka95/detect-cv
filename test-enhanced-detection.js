const fs = require("fs");

// Test cases with different name formats
const testCases = [
  {
    name: "Vietnamese - Họ tên",
    content: `HỒ SƠ CÁ NHÂN
Họ tên: Nguyễn Văn An
Email: nguyenvanan@gmail.com
Số điện thoại: 0901234567
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM`,
  },
  {
    name: "Vietnamese - Họ và tên",
    content: `CV CÁ NHÂN
Họ và tên: Trần Thị Bình
Email: tranbinh@example.com
Số điện thoại: 0912345678
Địa chỉ: 456 Đường XYZ, Quận 2, TP.HCM`,
  },
  {
    name: "Vietnamese - Họ tên đầy đủ",
    content: `HỒ SƠ ỨNG VIÊN
Họ tên đầy đủ: Lê Văn Cường
Email: levancuong@gmail.com
Số điện thoại: 0923456789
Địa chỉ: 789 Đường DEF, Quận 3, TP.HCM`,
  },
  {
    name: "English - Name",
    content: `PERSONAL RESUME
Name: John Smith
Email: johnsmith@example.com
Phone: +1234567890
Address: 123 Main Street, New York, NY`,
  },
  {
    name: "English - Full Name",
    content: `CURRICULUM VITAE
Full Name: Sarah Johnson
Email: sarah.johnson@example.com
Phone: +1987654321
Address: 456 Oak Avenue, Los Angeles, CA`,
  },
  {
    name: "English - First Name Last Name",
    content: `PROFESSIONAL PROFILE
First Name: Michael
Last Name: Brown
Email: michael.brown@example.com
Phone: +1122334455
Address: 789 Pine Street, Chicago, IL`,
  },
  {
    name: "Mixed Language",
    content: `HỒ SƠ / RESUME
Name: Nguyễn Anh Dũng
Full Name: Nguyen Anh Dung
Email: nguyenanh.dung@gmail.com
Phone: 0934567890
Address: 321 Đường GHI, Quận 4, TP.HCM`,
  },
];

// Function to test detection (simplified version of the server function)
function detectInformation(text) {
  const info = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails) {
    info.email = emails[0];
  }

  // Extract phone numbers
  const phoneRegex = /(\+84|84|0|\+1)[0-9]{9,10}/g;
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

  return info;
}

// Test all cases
console.log("🧪 Testing Enhanced Detection...\n");

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. Testing: ${testCase.name}`);
  console.log("📝 Content:");
  console.log(testCase.content);
  console.log("");

  const result = detectInformation(testCase.content);
  console.log("✅ Detected:");
  console.log(`   - Name: ${result.name}`);
  console.log(`   - Email: ${result.email}`);
  console.log(`   - Phone: ${result.phone}`);
  console.log(`   - Address: ${result.address}`);
  console.log("---\n");
});

console.log("🎉 Enhanced detection test completed!");
