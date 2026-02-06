// pages/CreateProductPage.jsx
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Checkbox from "../components/Checkbox";
import FileInput from "../Components/FileInput";
import Select from "../Components/Select";
export default function CreateProductPage() {
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

  // Ref untuk form
  const resetFormRef = useRef(null);
  function handleConfirmReset(e) {
    e.preventDefault();
    Swal.fire({
      position: "top",
      icon: "warning",
      title: "Reset the form?",
      showCancelButton: true,
      confirmButtonText: "Yes,reset",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(productFields);
        resetFormRef.current.reset();
      }
    });
  }
  const categories = [
    { value: "", label: "Pilih kategori" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "food", label: "Food & Beverage" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "file") {
      finalValue = files || value; // Dari FileInput component
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
    // Opsional ya ini, kalau pengen ada validasi di sisi frontendnya, atau dihilangkan juga boleh, jika validasinya full dari backend
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

    console.log("Form submitted!");
    console.log("Total images:", formData.images?.length || 0);

    // Log semua form data
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
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
          required
        />

        {/* FILE INPUT COMPONENT */}
        <FileInput
          label="Product Images"
          name="images"
          onChange={handleChange}
          error={errors.images}
          accept="image/*"
          multiple={true}
          //   maxFiles={5}
          required={true}
          showPreviews={true}
          previewSize={100}
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
          >
            Reset form
          </button>
          <button type="submit" className="btn primary">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
