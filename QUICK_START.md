# 🚀 Quick Start Guide - Detect CV

## Cách chạy ứng dụng nhanh nhất:

### Phương pháp 1: Sử dụng script tự động

```bash
./start-app.sh
```

### Phương pháp 2: Chạy thủ công

```bash
# Terminal 1: Chạy backend
cd server && node index.js

# Terminal 2: Chạy frontend
npm start
```

### Phương pháp 3: Sử dụng npm script

```bash
npm run dev
```

## 📱 Truy cập ứng dụng:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001

## 🎯 Cách sử dụng:

1. Mở trình duyệt và truy cập http://localhost:3000
2. Kéo thả hoặc click để chọn file PDF/hình ảnh
3. Click "Xử lý file" để trích xuất thông tin
4. Xem kết quả và tải file Excel

## 🔧 Troubleshooting:

### Nếu port bị chiếm:

```bash
# Kiểm tra process đang chạy
lsof -i :3000 -i :5001

# Kill process nếu cần
kill -9 <PID>
```

### Nếu có lỗi dependencies:

```bash
# Cài đặt lại dependencies
npm install
cd server && npm install
```

### Nếu server không start:

```bash
# Kiểm tra log
cd server && node index.js
```

## 📁 Cấu trúc file quan trọng:

- `src/App.js` - Frontend chính
- `server/index.js` - Backend API
- `package.json` - Dependencies frontend
- `server/package.json` - Dependencies backend

## 🎉 Ứng dụng đã sẵn sàng!
