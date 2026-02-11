// pages/EditProductPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import api from "../lib/axios";
import Input from "../Components/Input";
import Textarea from "../Components/Textarea";
import Checkbox from "../Components/Checkbox";
import FileInput from "../Components/FileInput";
import Select from "../Components/Select";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resetFormRef = useRef(null);

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // ✅ TAMBAH: Simpan data asli
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  const categories = [
    { value: "", label: "Pilih kategori" },
    { value: "daily", label: "Daily" },
    { value: "formal", label: "Formal" },
    { value: "sport", label: "Sport" },
    { value: "night", label: "Night" },
    { value: "body_mist", label: "Body mist" },
    { value: "other", label: "Other" },
  ];

  // Fetch product data saat component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const productData = {
          ...response.data.data,
          images: [],
          existingImages: response.data.data.images || [],
        };

        setFormData(productData);
        setOriginalData(productData); // ✅ Simpan data asli

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);

        let errorMessage = "Failed to load product data";

        if (error.response?.status === 404) {
          errorMessage = "Product not found";
        } else if (error.response?.status === 401) {
          errorMessage = "Unauthorized. Please login again.";
          navigate("/login");
          return;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setErrors({ fetch: errorMessage });
        setLoading(false);

        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error!",
          text: errorMessage,
        });
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Function untuk check apakah ada perubahan
  const hasChanges = () => {
    if (!formData || !originalData) return false;

    const fieldChanged =
      formData.name?.trim() !== originalData.name?.trim() ||
      Number(formData.price) !== Number(originalData.price) ||
      Number(formData.stock) !== Number(originalData.stock) ||
      formData.category !== originalData.category ||
      Boolean(formData.isFeatured) !== Boolean(originalData.isFeatured) ||
      formData.description?.trim() !== originalData.description?.trim();

    // Check new images
    const hasNewImages = formData.images && formData.images.length > 0;

    // Check deleted images
    const hasDeletedImages = deletedImages.length > 0;

    return fieldChanged || hasNewImages || hasDeletedImages;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "file") {
      finalValue = files;
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (e.target.error) {
      setErrors((prev) => ({ ...prev, [name]: e.target.error }));
    }
  };

  const removeExistingImage = (imageUrl) => {
    setDeletedImages((prev) => [...prev, imageUrl]);
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== imageUrl),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama produk harus diisi";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "Stok tidak boleh negatif";
    }

    if (!formData.category) {
      newErrors.category = "Kategori harus dipilih";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi harus diisi";
    }

    const totalImages =
      formData.existingImages.length + (formData.images?.length || 0);
    if (totalImages === 0) {
      newErrors.images = "Minimal 1 gambar produk";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ TAMBAH: Check jika tidak ada perubahan
    if (!hasChanges()) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "No Changes",
        text: "You haven't made any changes to update.",
      });
      return;
    }

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("isFeatured", formData.isFeatured);
    formDataToSend.append("description", formData.description);

    // Append new images
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((image) => {
        formDataToSend.append("newImages", image);
      });
    }

    // Append existing images yang dipertahankan
    formData.existingImages.forEach((imageUrl) => {
      formDataToSend.append("existingImages", imageUrl);
    });

    // Append deleted images untuk dihapus di backend
    deletedImages.forEach((imageUrl) => {
      formDataToSend.append("deletedImages", imageUrl);
    });

    try {
      const response = await api.put(`/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product updated:", response.data);

      // Success notification
      await Swal.fire({
        position: "top",
        icon: "success",
        title: "Product Updated!",
        text: "Your product has been successfully updated.",
        showConfirmButton: false,
        timer: 2000,
      });

      // Redirect ke detail page atau products list
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);

      // Handle validation errors dari backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);

        Swal.fire({
          position: "top",
          icon: "error",
          title: "Validation Error",
          text: "Please check the form and try again.",
        });
      } else if (error.response?.status === 404) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Product Not Found",
          text: "The product you're trying to update doesn't exist.",
        });
        navigate("/products/lists");
      } else if (error.response?.status === 401) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Unauthorized",
          text: "Please login again.",
        });
        navigate("/login");
      } else {
        // Generic error
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            "Failed to update product. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCancel = () => {
    Swal.fire({
      position: "top",
      icon: "warning",
      title: "Cancel editing?",
      text: "All unsaved changes will be lost.",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, continue editing",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/products/lists");
      }
    });
  };

  if (loading || !formData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading product data...</h2>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error Loading Product</h2>
        <p style={{ color: "#dc2626" }}>{errors.fetch}</p>
        <button
          onClick={() => navigate("/products/lists")}
          className="btn primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Editing Product ID: <strong>{id}</strong>
      </p>

      {errors.submit && (
        <div
          style={{
            padding: "12px",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            marginBottom: "20px",
            color: "#dc2626",
          }}
        >
          {errors.submit}
        </div>
      )}

      <form ref={resetFormRef} onSubmit={handleSubmit} className="form-wrapper">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
          disabled={isSubmitting}
        />

        <Input
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="0"
          min="0"
          disabled={isSubmitting}
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          error={errors.category}
          placeholder="Pilih kategori"
          disabled={isSubmitting}
        />

        <Checkbox
          label="Featured Product"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter product description"
          rows={6}
          disabled={isSubmitting}
        />

        {/* Existing Images Section */}
        {formData.existingImages.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <label>
              Current Images
              <span style={{ color: "#10b981", marginLeft: "8px" }}>
                ({formData.existingImages.length})
              </span>
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              {formData.existingImages.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <img
                    src={import.meta.env.VITE_BACKEND_BASE_URL + imageUrl}
                    alt={`Existing ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "2px solid #10b981",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeExistingImage(
                        import.meta.env.VITE_BACKEND_BASE_URL + imageUrl,
                      )
                    }
                    title="Remove this image"
                    className="btn-close"
                    aria-label={`Remove existing image ${index + 1}`}
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <FileInput
          label="Add New Images"
          name="images"
          onChange={handleChange}
          error={errors.images}
          accept="image/*"
          multiple={true}
          maxFiles={6}
          showPreviews={true}
          previewSize={100}
          disabled={isSubmitting}
        />

        {/* Image Summary Info Box */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "4px",
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>
            📊 Image Summary:
          </strong>
          <small style={{ display: "block", lineHeight: "1.6" }}>
            • Current images: <strong>{formData.existingImages.length}</strong>
            <br />• New images to upload:{" "}
            <strong>{formData.images?.length || 0}</strong>
            <br />• Images to delete:{" "}
            <strong style={{ color: "#dc2626" }}>{deletedImages.length}</strong>
            <br />• Total after save:{" "}
            <strong style={{ color: "#10b981" }}>
              {formData.existingImages.length + (formData.images?.length || 0)}
            </strong>
          </small>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "10px",
            justifyContent: "end",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            type="button"
            className="btn secondary"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn primary"
            disabled={isSubmitting || !hasChanges()}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
