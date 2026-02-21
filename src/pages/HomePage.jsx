// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../Components/ProductCard";
import EmptyState from "../Components/EmptyState";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "../helpers";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewestProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoadingFeatured(true);
      const { data } = await api.get("/products/featured?limit=8");

      // Add grid area for bento layout
      const productsWithArea = data.data.map((product, index) => ({
        ...product,
        area: `area${index + 1}`,
      }));

      setFeaturedProducts(productsWithArea);
    } catch (error) {
      console.error("Fetch featured products error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Featured Products",
        text: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchNewestProducts = async () => {
    try {
      setLoadingNewest(true);
      const { data } = await api.get("/products/newest?limit=8");
      setNewestProducts(data.data);
    } catch (error) {
      console.error("Fetch newest products error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Newest Products",
        text: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoadingNewest(false);
    }
  };

  return (
    <div>
      {/* Featured Products Section */}
      <h2 style={{ margin: "32px 0px" }}>Featured Products</h2>

      {loadingFeatured ? (
        <div
          className="loading-state"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <Loader2 className="spin" size={48} style={{ margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            Loading featured products...
          </p>
        </div>
      ) : featuredProducts.length > 0 ? (
        <div className="bento-grid">
          {featuredProducts.slice(0, 5).map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="bento-item"
              style={{ gridArea: product.area }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKEND_BASE_URL + product.images?.[0]
                }
                alt={product.name}
              />
              <figcaption>
                <h3>{product.name}</h3>
                <p>{formatRupiah(product.price)}</p>
              </figcaption>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No featured products"
          description="Check back later for featured products"
        />
      )}

      {/* Newest Products Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "32px 0px",
        }}
      >
        <h2 style={{ margin: 0 }}>Newest Products</h2>
        <Link to="/products" className="btn secondary">
          View All Products
        </Link>
      </div>

      {loadingNewest ? (
        <div
          className="loading-state"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <Loader2 className="spin" size={48} style={{ margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            Loading newest products...
          </p>
        </div>
      ) : newestProducts.length > 0 ? (
        <div className="products-grid">
          {newestProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              stock={product.stock}
              price={product.price}
              category={product.category}
              image={
                import.meta.env.VITE_BACKEND_BASE_URL + product.images?.[0]
              }
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products available"
          description="Check back later for new products"
        />
      )}
    </div>
  );
}
