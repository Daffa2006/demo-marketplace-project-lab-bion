import { useState, useEffect } from "react";
import Input from "../Components/Input";
import ProductCard from "../Components/ProductCard";
import api from "../lib/axios";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "daily", color: "#3b82f6" },
    { name: "formal", color: "#6366f1" },
    { name: "sport", color: "#22c55e" },
    { name: "night", color: "#f43f5e" },
    { name: "body_mist", color: "#f59e0b" },
  ];

  async function fetchProducts() {
    try {
      setLoading(true);

      let query = "";

      if (searchQuery) {
        query += `search=${searchQuery}`;
      }

      if (selectedCategory !== "all") {
        query += query ? "&" : "";
        query += `category=${selectedCategory}`;
      }

      const { data } = await api.get(`/products?${query}`);

      setProducts(data.data);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  return (
    <div className="product-list-page">
      <h2>Daftar Produk</h2>

      {/* Search */}
      <Input
        name="search"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search product by name..."
      />

      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={`category-btn ${
            selectedCategory === "all" ? "active" : ""
          }`}
          style={{
            borderColor: "#6b7280",
            backgroundColor:
              selectedCategory === "all" ? "#6b7280" : "transparent",
            color: selectedCategory === "all" ? "white" : "#6b7280",
          }}
          onClick={() => handleCategoryChange("all")}
        >
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`category-btn ${
              selectedCategory === cat.name ? "active" : ""
            }`}
            style={{
              borderColor: cat.color,
              backgroundColor:
                selectedCategory === cat.name ? cat.color : "transparent",
              color: selectedCategory === cat.name ? "white" : cat.color,
            }}
            onClick={() => handleCategoryChange(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="products-container">
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                stock={product.stock}
                price={product.price}
                category={product.category}
                image={product.images?.[0]}
                isFeatured={product.isFeatured}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}

        {loading && <div className="loading-state-overlay"></div>}
      </div>
    </div>
  );
}
