// components/FileInput.jsx
import { useRef, useState } from "react";

export default function FileInput({
  label,
  name,
  onChange,
  error,
  accept = "image/*",
  multiple = false,
  maxFiles = 6,
  required = false,
  showPreviews = true,
  previewSize = 100,
  disabled = false,
}) {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);

    // ✅ FIX: Gabungkan file lama + file baru
    const combinedFiles = [...files, ...newSelectedFiles];

    // Check max files
    if (multiple && combinedFiles.length > maxFiles) {
      onChange({
        target: {
          name,
          value: [],
          files: [],
          error: `Maksimal ${maxFiles} file. Anda sudah punya ${files.length} file.`,
        },
      });

      // Reset input value agar bisa pilih file yang sama lagi
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // ✅ Create preview untuk file baru aja
    const newPreviews = newSelectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    // ✅ Gabungkan preview lama + baru
    const combinedPreviews = [...previews, ...newPreviews];

    setPreviews(combinedPreviews);
    setFiles(combinedFiles);

    // Reset input value agar bisa pilih file lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Pass files ke parent component
    onChange({
      target: {
        name,
        value: combinedFiles,
        files: combinedFiles,
      },
    });
  };

  const removeFile = (index) => {
    // Revoke URL untuk free memory
    URL.revokeObjectURL(previews[index].url);

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);

    // Reset file input jika semua file dihapus
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Update parent
    onChange({
      target: {
        name,
        value: newFiles,
        files: newFiles,
      },
    });
  };

  const clearAll = () => {
    // Revoke semua URL
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    setFiles([]);
    setPreviews([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Update parent
    onChange({
      target: {
        name,
        value: [],
        files: [],
      },
    });
  };

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>

      <input
        ref={fileInputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {multiple && (
        <small>
          {files.length} / {maxFiles} files selected
        </small>
      )}

      {error && (
        <span id={`${name}-error`} className="error-message">
          {error}
        </span>
      )}

      {showPreviews && previews.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            {previews.map((preview, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: `${previewSize}px`,
                  height: `${previewSize}px`,
                }}
              >
                <img
                  src={preview.url}
                  alt={preview.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="btn-close"
                  aria-label={`Remove ${preview.name}`}
                  disabled={disabled}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {multiple && previews.length > 1 && (
            <button
              type="button"
              onClick={clearAll}
              className="btn destructive"
              style={{ marginTop: 24 }}
              disabled={disabled}
            >
              Clear All ({previews.length} files)
            </button>
          )}
        </>
      )}
    </div>
  );
}
