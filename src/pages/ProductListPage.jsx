// pages/ProductListPage.jsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Input from "../components/Input";
import ProductCard from "../components/ProductCard";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // ============================================
    // TODO: FETCH API
    // ============================================
    /*
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("https://your-api.com/api/products"),
      fetch("https://your-api.com/api/categories")
    ]);
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    setProducts(productsData);
    setFilteredProducts(productsData);
    setCategories(categoriesData);
    */
    // ============================================

    // MOCK DATA
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Samsung Galaxy S24 Ultra",
          price: 15999000,
          stock: 25,
          category: "Electronics",
          image:
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
          isFeatured: true,
        },
        {
          id: 2,
          name: "iPhone 15 Pro Max",
          price: 19999000,
          stock: 15,
          category: "Electronics",
          image:
            "https://images.unsplash.com/photo-1592286927505-eb0e1b9c6c90?w=400&h=400&fit=crop",
          isFeatured: true,
        },
        {
          id: 3,
          name: "Nike Air Max 270",
          price: 2499000,
          stock: 50,
          category: "Fashion",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          isFeatured: false,
        },
        {
          id: 4,
          name: "Adidas Ultraboost",
          price: 2899000,
          stock: 30,
          category: "Fashion",
          image:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
          isFeatured: false,
        },
        {
          id: 5,
          name: "Sony WH-1000XM5",
          price: 4999000,
          stock: 40,
          category: "Electronics",
          image:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
          isFeatured: true,
        },
      ];

      const mockCategories = [
        { name: "Electronics", color: "#3b82f6" },
        { name: "Fashion", color: "#ec4899" },
        { name: "Books", color: "#10b981" },
        { name: "Food", color: "#8b5cf6" },
      ];

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  };

  const applyFilters = (search, category) => {
    setLoading(true);

    setTimeout(() => {
      let filtered = products;

      // Filter by search
      if (search.trim()) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      // Filter by category
      if (category !== "all") {
        filtered = filtered.filter((product) => product.category === category);
      }

      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);
  };

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
          className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
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
            className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
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

      {/* Products Grid */}
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                stock={product.stock}
                price={product.price}
                category={product.category}
                image={product.image}
                isFeatured={product.isFeatured}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && <div className="loading-state-overlay"></div>}
      </div>
    </div>
  );
}
