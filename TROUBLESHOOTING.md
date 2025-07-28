# 🔧 Troubleshooting Guide - Detect CV

## 🚨 Lỗi thường gặp và cách khắc phục

### 1. **Lỗi "File không tồn tại" khi tải Excel**

**Nguyên nhân:**

- File Excel chưa được tạo đúng cách
- Đường dẫn file không chính xác
- Server chưa khởi động đúng cách

**Cách khắc phục:**

```bash
# 1. Kiểm tra server có đang chạy không
curl http://localhost:5001/api/health

# 2. Kiểm tra thư mục uploads
ls -la uploads/

# 3. Restart server
cd server && node index.js

# 4. Test download với file test
node test-download.js
```

### 2. **Lỗi "Cannot connect to server"**

**Nguyên nhân:**

- Backend server chưa chạy
- Port bị chiếm bởi process khác

**Cách khắc phục:**

```bash
# 1. Kiểm tra process đang chạy
lsof -i :5001

# 2. Kill process nếu cần
kill -9 <PID>

# 3. Chạy lại server
cd server && node index.js
```

### 3. **Lỗi "File quá lớn"**

**Nguyên nhân:**

- File upload vượt quá 10MB

**Cách khắc phục:**

- Nén file trước khi upload
- Hoặc tăng limit trong server/index.js

### 4. **Lỗi OCR không hoạt động**

**Nguyên nhân:**

- Hình ảnh không rõ nét
- Tesseract.js chưa load đúng

**Cách khắc phục:**

- Sử dụng hình ảnh có độ phân giải cao
- Đảm bảo văn bản trong hình rõ ràng
- Kiểm tra console log để xem lỗi chi tiết

### 5. **Lỗi PDF không đọc được**

**Nguyên nhân:**

- File PDF bị khóa hoặc corrupt
- pdf-parse không hỗ trợ format này

**Cách khắc phục:**

- Thử với file PDF khác
- Chuyển đổi PDF sang text trước
- Sử dụng file HTML thay thế

### 6. **Lỗi "Port already in use"**

**Cách khắc phục:**

```bash
# 1. Tìm process đang sử dụng port
lsof -i :3000 -i :5001

# 2. Kill process
kill -9 <PID>

# 3. Hoặc thay đổi port trong code
```

### 7. **Lỗi "Module not found"**

**Cách khắc phục:**

```bash
# 1. Cài đặt lại dependencies
npm install
cd server && npm install

# 2. Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 🧪 **Test Scripts**

### Test Download:

```bash
node test-download.js
```

### Test Full Flow:

```bash
node test-full-flow.js
```

### Test Upload:

```bash
node test-app.js
```

## 📊 **Debug Information**

### Kiểm tra logs:

```bash
# Server logs
cd server && node index.js

# Frontend logs (trong browser)
F12 → Console
```

### Kiểm tra file system:

```bash
# Thư mục uploads
ls -la uploads/

# File permissions
chmod 755 uploads/
```

### Kiểm tra network:

```bash
# Test API endpoints
curl http://localhost:5001/api/health
curl http://localhost:3000
```

## 🔄 **Reset Application**

Nếu có lỗi nghiêm trọng, reset toàn bộ:

```bash
# 1. Stop tất cả processes
pkill -f "node.*server"
pkill -f "react-scripts"

# 2. Xóa cache
rm -rf node_modules package-lock.json
cd server && rm -rf node_modules package-lock.json
cd ..

# 3. Cài đặt lại
npm install
cd server && npm install
cd ..

# 4. Chạy lại
./start-app.sh
```

## 📞 **Support**

Nếu vẫn gặp vấn đề:

1. Kiểm tra logs trong console
2. Chạy test scripts để debug
3. Kiểm tra file permissions
4. Restart server và frontend
