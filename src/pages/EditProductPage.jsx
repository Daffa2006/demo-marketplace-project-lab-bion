// pages/EditProductPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Input from "../Components/Input";
import Textarea from "../Components/Textarea";
import Checkbox from "../Components/Checkbox";
import FileInput from "../Components/FileInput";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    isFeatured: false,
    description: "",
    images: [],
    existingImages: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  const categories = [
    { value: "", label: "Pilih kategori" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "food", label: "Food & Beverage" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
  ];

  // Fetch product data saat component mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // ============================================
      // TODO: FETCH API - Replace mock data dengan API call
      // ============================================
      /*
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://your-api.com/api/products/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        setFormData({
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          isFeatured: data.isFeatured,
          description: data.description,
          images: [],
          existingImages: data.images || [] // Array of image URLs dari backend
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrors({ fetch: "Failed to load product data" });
        setLoading(false);
      }
      */
      // ============================================
      // END TODO
      // ============================================

      // MOCK DATA - Hapus ini saat sudah pakai API
      setTimeout(() => {
        setFormData({
          name: "Samsung Galaxy S24 Ultra",
          price: "15999000",
          stock: "25",
          category: "electronics",
          isFeatured: true,
          description:
            "Flagship smartphone dengan kamera 200MP, layar Dynamic AMOLED 2X, dan prosesor Snapdragon 8 Gen 3 terbaru.",
          images: [],
          existingImages: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
          ],
        });
        setLoading(false);
      }, 500); // Simulasi loading
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "file") {
      finalValue = files || value;
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

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ============================================
    // TODO: SUBMIT API - Replace console.log dengan API call
    // ============================================
    /*
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
      const token = localStorage.getItem("token");
      const response = await fetch(`https://your-api.com/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
          // Jangan set Content-Type untuk FormData, browser akan set otomatis
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const result = await response.json();
      console.log("Product updated:", result);

      // Redirect ke detail page
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({ submit: "Failed to update product. Please try again." });
    }
    */
    // ============================================
    // END TODO
    // ============================================

    // MOCK SUBMIT - Hapus ini saat sudah pakai API
    console.log("=== FORM SUBMITTED ===");
    console.log("Product ID:", id);
    console.log("Form Data:", {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
      isFeatured: formData.isFeatured,
      description: formData.description,
    });
    console.log("New images:", formData.images?.length || 0);
    console.log("Existing images:", formData.existingImages);
    console.log("Deleted images:", deletedImages);

    alert("Product updated successfully! (Mock)");
    // navigate(`/products/${id}`); // Uncomment saat sudah siap
  };

  if (loading) {
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
        <button onClick={() => navigate("/products/lists")}>
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

      <form onSubmit={handleSubmit} className="form-wrapper">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
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
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          error={errors.category}
          placeholder="Pilih kategori"
        />

        <Checkbox
          label="Featured Product"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter product description"
          rows={6}
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
                    src={imageUrl}
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
                    onClick={() => removeExistingImage(imageUrl)}
                    title="Remove this image"
                    className="btn-close"
                    aria-label={`Remove existing image ${index + 1}`}
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
          //   maxFiles={5}
          required={false}
          showPreviews={true}
          previewSize={100}
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

        {/* Action Button */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "10px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button type="submit" className="btn primary">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
