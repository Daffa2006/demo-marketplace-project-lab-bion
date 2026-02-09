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
  Loader2,
} from "lucide-react";
import Input from "../Components/Input";
import Textarea from "../Components/Textarea";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatRupiah } from "../helpers";
import api from "../lib/axios";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    phone: "",
    notes: "",
    paymentMethod: "whatsapp",
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    // Pre-fill form with user data if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || "",
      }));
    }
  }, [user]);

  // Check cart only once after initial load
  useEffect(() => {
    if (!initialCheckDone) {
      const timer = setTimeout(() => {
        setLoading(false);
        setInitialCheckDone(true);

        // Check if cart is empty after loading
        if (cart.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Cart is Empty",
            text: "Please add items to cart first",
          }).then(() => {
            navigate("/products");
          });
        }
      }, 100); // Small delay to let useCart load from localStorage

      return () => clearTimeout(timer);
    }
  }, [cart, initialCheckDone, navigate]);


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

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Nama harus diisi";
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

  const generateWhatsAppMessage = (orderId) => {
    const itemsList = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n   Qty: ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`
      )
      .join("\n\n");

    const message = `Halo Admin, saya ${formData.customerName}

Saya ingin konfirmasi order dengan:
Order ID: ${orderId}

Detail Pesanan:
${itemsList}

Total: ${formatRupiah(getCartTotal())}

Alamat Pengiriman:
${formData.address}

No. Telepon: ${formData.phone}

${formData.notes ? `Catatan: ${formData.notes}` : ""}

Terima kasih!`;

    return encodeURIComponent(message);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Cart is Empty",
        text: "Please add items to cart first",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare order items for API
      const items = cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));

      // Create order via API
      const { data } = await api.post("/orders", {
        items,
        customerName: formData.customerName,
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
      });

      // Clear cart after successful order
      clearCart();

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Order Created!",
        html: `
          <p>Order ID: <strong>${data.data.orderId}</strong></p>
          <p>Total: <strong>${formatRupiah(data.data.totalAmount)}</strong></p>
          <p>Status: <strong>${data.data.status}</strong></p>
        `,
        confirmButtonText: "OK",
      });

      // Open WhatsApp if payment method is whatsapp
      if (formData.paymentMethod === "whatsapp") {
        const whatsappNumber = "6283897685406"; // Admin WhatsApp number
        const message = generateWhatsAppMessage(data.data.orderId);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      }

      // Navigate to check orders page
      navigate("/check-orders");
    } catch (error) {
      console.error("Checkout error:", error);

      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: error.response?.data?.message || "Failed to create order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while cart is being loaded from localStorage
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "1rem",
        }}
      >
        <Loader2 className="spin" size={48} color="#f97316" />
        <p style={{ color: "#6b7280" }}>Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div
        className="checkout-empty"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "1rem",
        }}
      >
        <ShoppingBag size={64} color="#6b7280" />
        <h2>No items to checkout</h2>
        <p style={{ color: "#6b7280" }}>Please add items to your cart first</p>
        <Link to="/products" className="btn primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h1>Checkout</h1>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="checkout-order">
          <div className="order-header">
            <h2>Order Summary</h2>
            <span className="order-id">{cart.length} item(s)</span>
          </div>

          <div className="order-items">
            {cart.map((item) => (
              <div key={item.productId} className="order-item">
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
                <div className="order-item-details">
                  <h3>{item.name}</h3>
                  <div className="order-item-pricing">
                    <span className="quantity">Qty: {item.quantity}</span>
                    <span className="price">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="order-item-total">
                    Subtotal:{" "}
                    <strong>{formatRupiah(item.price * item.quantity)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Total</span>
              <span>{formatRupiah(getCartTotal())}</span>
            </div>
          </div>
        </div>

        {/* Customer Info Form */}
        <div className="checkout-form">
          <h2>Informasi Pemesan</h2>

          <form onSubmit={handleCheckout}>
            <Input
              label="Nama Lengkap"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              error={errors.customerName}
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
              label="Catatan Pembeli (Opsional)"
              onChange={handleChange}
              name="notes"
              value={formData.notes}
              placeholder="Contoh: Tolong barangnya di anuin dan dianukan"
            />

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Metode Pembayaran
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  fontSize: "16px",
                }}
              >
                <option value="whatsapp">WhatsApp (Konfirmasi via WA)</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cod">Cash on Delivery (COD)</option>
              </select>
            </div>

            {formData.paymentMethod === "whatsapp" && (
              <div className="checkout-info">
                <MessageCircle size={20} />
                <p>
                  Setelah klik tombol di bawah, Anda akan diarahkan ke WhatsApp
                  untuk konfirmasi pesanan dengan admin.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <Loader2 className="spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {formData.paymentMethod === "whatsapp" ? (
                    <>
                      <MessageCircle size={20} />
                      <span>Checkout via WhatsApp</span>
                    </>
                  ) : (
                    <span>Place Order</span>
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
