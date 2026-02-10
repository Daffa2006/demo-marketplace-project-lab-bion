import { useState, useEffect } from "react";
import Input from "../Components/Input";
import ProductCard from "../Components/ProductCard";
import EmptyState from "../Components/EmptyState";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const categories = [
    { name: "electronics", color: "#3b82f6" },
    { name: "fashion", color: "#6366f1" },
    { name: "food", color: "#22c55e" },
    { name: "books", color: "#f43f5e" },
    { name: "sports", color: "#f59e0b" },
    { name: "toys", color: "#8b5cf6" },
  ];

  async function fetchProducts(page = 1) {
    try {
      setLoading(true);

      let query = `page=${page}&limit=${pagination.limit}`;

      if (searchQuery) {
        query += `&search=${searchQuery}`;
      }

      if (selectedCategory !== "all") {
        query += `&category=${selectedCategory}`;
      }

      const { data } = await api.get(`/products?${query}`);

      setProducts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Fetch products error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Products",
        text: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Reset to page 1 when search or category changes
    fetchProducts(1);
  }, [searchQuery, selectedCategory]);

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(newPage);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        {loading ? (
          <div
            className="loading-state"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <Loader2 className="spin" size={48} style={{ margin: "0 auto" }} />
            <p style={{ marginTop: "1rem", color: "#6b7280" }}>
              Loading products...
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div
                className="pagination"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "2rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{ minWidth: "80px" }}
                >
                  Previous
                </button>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      className={`btn ${pagination.page === page ? "primary" : "secondary"}`}
                      onClick={() => handlePageChange(page)}
                      style={{
                        minWidth: "40px",
                        padding: "0.5rem",
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  style={{ minWidth: "80px" }}
                >
                  Next
                </button>
              </div>
            )}

            {/* Pagination Info */}
            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              Showing {products.length} of {pagination.total} products
              {pagination.pages > 1 &&
                ` (Page ${pagination.page} of ${pagination.pages})`}
            </div>
          </>
        ) : (
          <EmptyState
            title="No products found"
            description={
              searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "No products available at the moment"
            }
          />
        )}
      </div>
    </div>
  );
}
