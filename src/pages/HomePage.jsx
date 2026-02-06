// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // ============================================
    // TODO: FETCH PRODUCTS API
    // ============================================
    /*
    const response = await fetch("https://your-api.com/api/products?featured=true");
    const data = await response.json();
    setFeaturedProducts(data.featured);
    setNewestProducts(data.newest);
    */
    // ============================================

    // MOCK DATA untuk Featured Products (Bento Grid)
    const mockFeatured = [
      {
        id: 1,
        name: "iPhone",
        price: 19999000,
        image:
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lfGVufDB8fDB8fHww",
        area: "area1", // Large hero item
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 15999000,
        image:
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
        area: "area2", // Medium item
      },
      {
        id: 3,
        name: "MacBook Pro M3",
        price: 28999000,
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
        area: "area3", // Medium item
      },
      {
        id: 4,
        name: "Sony WH-1000XM5",
        price: 4999000,
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
        area: "area4", // Small item
      },
      {
        id: 5,
        name: "iPad Air M2",
        price: 9999000,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        area: "area5", // Small item
      },
    ];

    // MOCK DATA untuk Newest Products
    const mockNewest = [
      {
        id: 7,
        name: "Nike Air Max 270",
        price: 2499000,
        stock: 50,
        category: "Fashion",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      },
      {
        id: 8,
        name: "Adidas Ultraboost 22",
        price: 2899000,
        stock: 30,
        category: "Fashion",
        image:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
      },
      {
        id: 9,
        name: "Canon EOS R6 Mark II",
        price: 42999000,
        stock: 15,
        category: "Electronics",
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      },
      {
        id: 10,
        name: "PlayStation 5",
        price: 7999000,
        stock: 25,
        category: "Gaming",
        image:
          "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
      },
      {
        id: 11,
        name: "The Psychology of Money",
        price: 125000,
        stock: 100,
        category: "Books",
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      },
      {
        id: 12,
        name: "Organic Coffee Beans 1kg",
        price: 250000,
        stock: 60,
        category: "Food",
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      },
      {
        id: 13,
        name: "LEGO Star Wars Set",
        price: 1500000,
        stock: 20,
        category: "Toys",
        image:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
      },
      {
        id: 14,
        name: "Mechanical Keyboard RGB",
        price: 1299000,
        stock: 40,
        category: "Electronics",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
      },
    ];

    setFeaturedProducts(mockFeatured);
    setNewestProducts(mockNewest);
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleNavigateToDetailProduct = (productId) => {
    // Navigate handled by Link component
  };

  return (
    <div>
      <h2 style={{ margin: "32px 0px" }}>Featured Products</h2>
      <div className="bento-grid">
        {featuredProducts.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="bento-item"
            style={{ gridArea: product.area }}
          >
            <img src={product.image} alt={product.name} />
            <figcaption>
              <h3>{product.name}</h3>
              <p>{formatRupiah(product.price)}</p>
            </figcaption>
          </Link>
        ))}
      </div>

      <h2 style={{ margin: "32px 0px" }}>Newest Products</h2>
      <div className="products-grid">
        {newestProducts.map((product) => (
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
    </div>
  );
}
