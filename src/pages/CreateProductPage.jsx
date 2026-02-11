// pages/CreateProductPage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router"; // Import useNavigate
import Swal from "sweetalert2";
import api from "../lib/axios"; // Import axios instance
import Input from "../Components/Input";
import Textarea from "../Components/Textarea";
import Checkbox from "../Components/Checkbox";
import FileInput from "../Components/FileInput";
import Select from "../Components/Select";

export default function CreateProductPage() {
  const navigate = useNavigate(); // Initialize navigate
  const productFields = {
    name: "",
    price: "",
    stock: "",
    category: "",
    isFeatured: false,
    description: "",
    images: [],
  };
  const [formData, setFormData] = useState(productFields);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Ref untuk form
  const resetFormRef = useRef(null);

  function handleConfirmReset(e) {
    e.preventDefault();
    Swal.fire({
      position: "top",
      icon: "warning",
      title: "Reset the form?",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(productFields);
        setErrors({});
        resetFormRef.current.reset();
      }
    });
  }

  const categories = [
    { value: "", label: "Pilih kategori" },
    { value: "daily", label: "Daily" },
    { value: "formal", label: "Formal" },
    { value: "sport", label: "Sport" },
    { value: "night", label: "Night" },
    { value: "body_mist", label: "Body mist" },
    { value: "other", label: "Other" },
  ];

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

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle error dari FileInput
    if (e.target.error) {
      setErrors((prev) => ({ ...prev, [name]: e.target.error }));
    }
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

    if (!formData.images || formData.images.length === 0) {
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

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("isFeatured", formData.isFeatured);
    formDataToSend.append("description", formData.description);

    // Append images
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((image) => {
        formDataToSend.append("images", image);
      });
    }

    try {
      const response = await api.post("/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product created:", response.data);

      // Success notification
      await Swal.fire({
        position: "top",
        icon: "success",
        title: "Product Created!",
        text: "Your product has been successfully created.",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset form
      setFormData(productFields);
      setErrors({});
      resetFormRef.current.reset();

      // Redirect to products list (opsional)
      // navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);

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
      } else {
        // Generic error
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            "Failed to create product. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>

      <form ref={resetFormRef} onSubmit={handleSubmit} className="form-wrapper">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
          required
          disabled={isLoading}
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
          required
          disabled={isLoading}
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
          required
          disabled={isLoading}
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          error={errors.category}
          placeholder="Pilih kategori"
          required
          disabled={isLoading}
        />

        <Checkbox
          label="Featured Product"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          disabled={isLoading}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter product description"
          rows={6}
          required
          disabled={isLoading}
        />

        <FileInput
          label="Product Images"
          name="images"
          onChange={handleChange}
          error={errors.images}
          accept="image/*"
          multiple={true}
          required={true}
          showPreviews={true}
          previewSize={100}
          disabled={isLoading}
        />

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "10px",
            justifyContent: "end",
          }}
        >
          <button
            type="button"
            className="btn secondary"
            onClick={handleConfirmReset}
            disabled={isLoading}
          >
            Reset form
          </button>
          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
