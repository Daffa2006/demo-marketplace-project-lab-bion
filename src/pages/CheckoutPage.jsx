// pages/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Input from "../Components/Input";
import Textarea from "../Components/Textarea";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCheckoutData = async () => {
      setLoading(true);

      // ============================================
      // TODO: FETCH CHECKOUT DATA API
      // ============================================
      /*
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const profileResponse = await fetch("https://your-api.com/api/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const profile = await profileResponse.json();

        // Fetch cart items
        const cartResponse = await fetch("https://your-api.com/api/cart", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const cart = await cartResponse.json();

        // Create order (generate order ID)
        const orderResponse = await fetch("https://your-api.com/api/orders/create", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: cart.items
          })
        });
        const order = await orderResponse.json();

        setFormData({
          name: profile.name || "",
          address: profile.address || "",
          phone: profile.phone || ""
        });

        setOrderData(order);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
      */
      // ============================================

      // MOCK DATA - Hapus saat sudah pakai API
      setTimeout(() => {
        setFormData({
          name: "Daffa Anaqi Farid",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          phone: "083897685406",
        });

        setOrderData({
          orderId: "ORD-" + Date.now(),
          items: [
            {
              id: 1,
              name: "Samsung Galaxy S24 Ultra",
              price: 15999000,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
            },
            {
              id: 2,
              name: "iPhone 15 Pro Max",
              price: 19999000,
              quantity: 2,
              image:
                "https://images.unsplash.com/photo-1592286927505-eb0e1b9c6c90?w=300&h=300&fit=crop",
            },
          ],
          totalPrice: 55997000,
          createdAt: new Date().toISOString(),
        });

        setLoading(false);
      }, 500);
    };

    fetchCheckoutData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat harus diisi";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/^0/, ""))) {
      newErrors.phone = "Nomor telepon tidak valid (10-13 digit)";
    }

    return newErrors;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateWhatsAppMessage = () => {
    if (!orderData) return "";

    const itemsList = orderData.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n   Qty: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`,
      )
      .join("\n\n");

    const message = `Halo Admin, saya ${formData.name}
    Saya ingin konfirmasi order dengan ID : ${orderData.orderId}`;
    return encodeURIComponent(message);
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Redirect ke WhatsApp
    const whatsappNumber = "6283897685406"; // Ganti dengan nomor admin
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    // ============================================
    // TODO: SAVE ORDER TO DATABASE
    // ============================================
    /*
    const token = localStorage.getItem("token");
    await fetch("https://your-api.com/api/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        items: orderData.items,
        customerInfo: formData,
        totalPrice: orderData.totalPrice,
        status: "pending"
      })
    });
    */
    // ============================================
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <h2>Preparing checkout...</h2>
      </div>
    );
  }

  if (!orderData || orderData.items.length === 0) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={64} />
        <h2>No items to checkout</h2>
        <p>Please add items to your cart first</p>
        <Link to="/products/lists" className="btn primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Back to Cart</span>
      </button>

      <h1>Checkout</h1>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="checkout-order">
          <div className="order-header">
            <h2>Order Summary</h2>
            <span className="order-id">Order ID: {orderData.orderId}</span>
          </div>

          <div className="order-items">
            {orderData.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="order-item-details">
                  <h3>{item.name}</h3>
                  <div className="order-item-pricing">
                    <span className="quantity">Qty: {item.quantity}</span>
                    <span className="price">{formatPrice(item.price)}</span>
                  </div>
                  <div className="order-item-total">
                    Subtotal:{" "}
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Total</span>
              <span>{formatPrice(orderData.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info Form */}
        <div className="checkout-form">
          <h2>Informasi Pemesan</h2>

          <form onSubmit={handleCheckout}>
            <Input
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Masukkan nama lengkap"
              required
            />

            <Input
              label="Alamat Lengkap"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Jl. Nama Jalan No. XX, Kota"
              required
            />

            <Input
              label="Nomor Telepon"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="08xxxxxxxxxx"
              required
            />
            <Textarea
              style={{ height: "120px" }}
              label="Catatan pembeli"
              onChange={handleChange}
              name="note"
              placeholder="Tolong barangnya di anuin dan dianukan"
            />
            <div className="checkout-info">
              <MessageCircle size={20} />
              <p>
                Setelah klik tombol di bawah, Anda akan diarahkan ke WhatsApp
                untuk konfirmasi pesanan dengan admin.
              </p>
            </div>

            <button type="submit" className="btn primary">
              <MessageCircle size={20} />
              <span>Checkout via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
