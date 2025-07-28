# Detect CV - Trích xuất thông tin từ PDF và hình ảnh

Ứng dụng web hiện đại được xây dựng bằng React và Node.js để trích xuất thông tin từ file PDF và hình ảnh, sau đó lưu vào file Excel.

## 🚀 Tính năng

- **Upload file**: Hỗ trợ file PDF và hình ảnh (JPEG, PNG)
- **Drag & Drop**: Giao diện kéo thả file trực quan
- **OCR**: Trích xuất văn bản từ hình ảnh bằng Tesseract.js
- **PDF Processing**: Đọc và trích xuất văn bản từ file PDF
- **Information Detection**: Tự động phát hiện thông tin như:
  - Tên
  - Email
  - Số điện thoại
  - Địa chỉ
  - Học vấn
  - Kinh nghiệm
  - Kỹ năng
- **Excel Export**: Tạo file Excel với thông tin đã phát hiện
- **Responsive Design**: Giao diện đẹp và tương thích mobile

## 🛠️ Cài đặt

### Yêu cầu hệ thống

- Node.js (version 14 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd detect-cv
```

### Bước 2: Cài đặt dependencies

**Frontend (React):**

```bash
npm install
```

**Backend (Node.js):**

```bash
cd server
npm install
cd ..
```

### Bước 3: Chạy ứng dụng

**Chạy cả frontend và backend cùng lúc:**

```bash
npm run dev
```

**Hoặc chạy riêng lẻ:**

Backend:

```bash
cd server
npm run dev
```

Frontend (trong terminal khác):

```bash
npm start
```

## 📁 Cấu trúc project

```
detect-cv/
├── public/                 # Static files
├── src/                    # React source code
│   ├── App.js             # Main React component
│   ├── App.css            # Component styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── server/                 # Backend server
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── uploads/               # Uploaded files (auto-created)
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🔧 Cấu hình

### Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

### File size limit

- Tối đa: 10MB per file

### Supported file types

- PDF (.pdf)
- Images (.jpg, .jpeg, .png)

## 🎯 Cách sử dụng

1. **Mở ứng dụng**: Truy cập http://localhost:3000
2. **Upload file**: Kéo thả hoặc click để chọn file PDF/hình ảnh
3. **Xử lý**: Click "Xử lý file" để trích xuất thông tin
4. **Xem kết quả**: Thông tin được phát hiện sẽ hiển thị
5. **Tải Excel**: Click "Tải file Excel" để download kết quả

## 🔍 Thuật toán phát hiện thông tin

### Email

- Regex pattern: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g`

### Số điện thoại (Việt Nam)

- Regex pattern: `/(\+84|84|0)[0-9]{9,10}/g`

### Tên

- Tìm kiếm pattern: "Họ tên:", "Tên:", "Name:"
- Hoặc dòng đầu tiên có chữ cái in hoa

### Địa chỉ

- Tìm kiếm pattern: "Địa chỉ:", "Address:", "Sống tại:"

### Học vấn

- Tìm kiếm pattern: "Học vấn:", "Education:", "Tốt nghiệp:"

### Kinh nghiệm

- Tìm kiếm pattern: "Kinh nghiệm:", "Experience:", "Làm việc:"

### Kỹ năng

- Tìm kiếm pattern: "Kỹ năng:", "Skills:", "Công nghệ:"

## 🛠️ Công nghệ sử dụng

### Frontend

- React 18
- React Dropzone (file upload)
- Axios (HTTP client)
- File-saver (download files)

### Backend

- Express.js
- Multer (file upload)
- pdf-parse (PDF processing)
- Tesseract.js (OCR)
- XLSX (Excel generation)
- Sharp (image processing)

## 🐛 Troubleshooting

### Lỗi "Cannot connect to server"

- Kiểm tra backend có đang chạy không
- Kiểm tra port 5001 có bị chiếm không

### Lỗi "File too large"

- Giảm kích thước file (tối đa 10MB)
- Nén hình ảnh trước khi upload

### Lỗi OCR không hoạt động

- Đảm bảo hình ảnh có độ phân giải tốt
- Hình ảnh phải có văn bản rõ ràng

### Lỗi PDF không đọc được

- Kiểm tra file PDF có bị khóa không
- Thử với file PDF khác

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub.
