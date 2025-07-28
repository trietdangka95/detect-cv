import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { saveAs } from "file-saver";
import "./App.css";

const API_BASE_URL = "http://localhost:5001/api";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setDetectedInfo(null);
      setMessage("");
      setExcelFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!uploadedFile) {
      setMessage("Vui lòng chọn file để upload");
      setMessageType("error");
      return;
    }

    setIsProcessing(true);
    setMessage("Đang xử lý file...");

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutes timeout
      });

      if (response.data.success) {
        setDetectedInfo(response.data.data.detectedInfo);
        setExcelFile(response.data.data.excelFile);
        setMessage("Xử lý file thành công!");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Có lỗi xảy ra khi xử lý file";

      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!excelFile) {
      setMessage("Không có file Excel để tải");
      setMessageType("error");
      return;
    }

    try {
      setMessage("Đang tải file Excel...");
      setMessageType("success");

      const response = await axios.get(
        `${API_BASE_URL}/download/${excelFile}`,
        {
          responseType: "blob",
          timeout: 30000, // 30 seconds timeout
        }
      );

      // Check if response is actually a blob
      if (response.data instanceof Blob) {
        saveAs(response.data, excelFile);
        setMessage("Tải file Excel thành công!");
        setMessageType("success");
      } else {
        throw new Error("Response is not a valid file");
      }
    } catch (error) {
      console.error("Download error:", error);
      let errorMessage = "Có lỗi xảy ra khi tải file Excel";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "File Excel không tồn tại trên server";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server khi tải file";
        } else {
          errorMessage = error.response.data?.error || errorMessage;
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Tải file bị timeout, vui lòng thử lại";
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setUploadedFile(null);
    setDetectedInfo(null);
    setMessage("");
    setMessageType("");
    setExcelFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <h1>🔍 Detect CV - Trích xuất thông tin từ PDF và hình ảnh</h1>
          <p>
            Upload file PDF hoặc hình ảnh để trích xuất thông tin và tạo file
            Excel
          </p>

          <div
            {...getRootProps()}
            className={`upload-area ${isDragActive ? "dragover" : ""}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Thả file vào đây...</p>
            ) : (
              <div>
                <p>📁 Kéo thả file vào đây hoặc click để chọn file</p>
                <p>
                  <small>Hỗ trợ: PDF, JPEG, PNG (tối đa 10MB)</small>
                </p>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="file-info">
              <h3>📄 File đã chọn:</h3>
              <p>
                <strong>Tên file:</strong> {uploadedFile.name}
              </p>
              <p>
                <strong>Kích thước:</strong> {formatFileSize(uploadedFile.size)}
              </p>
              <p>
                <strong>Loại file:</strong> {uploadedFile.type}
              </p>
            </div>
          )}

          {message && <div className={`${messageType}-message`}>{message}</div>}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="btn"
              onClick={handleUpload}
              disabled={!uploadedFile || isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "🚀 Xử lý file"}
            </button>

            {uploadedFile && (
              <button
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isProcessing}
              >
                🔄 Chọn file khác
              </button>
            )}
          </div>

          {isProcessing && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang trích xuất thông tin từ file...</p>
            </div>
          )}

          {detectedInfo && (
            <div className="card">
              <h2>📋 Thông tin đã phát hiện</h2>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Tên</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.name ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.name || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.email ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.email || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Số điện thoại</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.phone ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.phone || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Địa chỉ</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.address ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.address || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Học vấn</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.education ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.education || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Kinh nghiệm</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.experience ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.experience || "Không tìm thấy"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Kỹ năng</div>
                  <div
                    className={`info-value ${
                      !detectedInfo.skills ? "empty" : ""
                    }`}
                  >
                    {detectedInfo.skills || "Không tìm thấy"}
                  </div>
                </div>
              </div>

              {excelFile && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button className="btn" onClick={handleDownloadExcel}>
                    📊 Tải file Excel
                  </button>
                </div>
              )}

              {detectedInfo.rawText && (
                <div style={{ marginTop: "30px" }}>
                  <h3>📝 Văn bản gốc</h3>
                  <div className="text-preview">{detectedInfo.rawText}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
