// pages/OrderDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
    Package,
    Calendar,
    CreditCard,
    MapPin,
    Phone,
    User,
    ArrowLeft,
    Loader2,
    Clock,
    CheckCircle,
    XCircle,
    MessageCircle,
} from "lucide-react";
import api from "../lib/axios";
import { formatRupiah } from "../helpers";
import Swal from "sweetalert2";

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data.data);
        } catch (error) {
            console.error("Fetch order error:", error);
            Swal.fire({
                icon: "error",
                title: "Order Not Found",
                text: error.response?.data?.message || "Failed to load order details",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleWhatsAppConfirmation = () => {
        if (!order) return;

        const itemsList = order.items
            .map(
                (item, index) =>
                    `${index + 1}. ${item.name}\n   Qty: ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}`
            )
            .join("\n\n");

        const message = `Halo Admin, saya ${order.customerName}

Saya ingin konfirmasi ulang order dengan:
Order ID: ${order.orderId}

Detail Pesanan:
${itemsList}

Total: ${formatRupiah(order.totalAmount)}

Status Pembayaran: ${order.paymentStatus}

Terima kasih!`;

        const whatsappNumber = "6283897685406"; // Admin WhatsApp number
        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Loader2 className="spin" size={48} color="#f97316" />
                <p style={{ color: "#6b7280" }}>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
                <h2>Order Not Found</h2>
                <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                    The order you are looking for does not exist or you don't have permission to view it.
                </p>
                <Link to="/check-orders" className="btn primary">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="order-detail-container">
            {/* Header */}
            <div className="order-detail-header">
                <Link to="/check-orders" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Orders</span>
                </Link>
                <div className="order-id-badge">
                    <h1>Order Detail</h1>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <p className="order-ref">Reference ID: {order.orderId}</p>
                <p className="order-date">
                    <Calendar size={16} />
                    {formatDate(order.createdAt)}
                </p>
            </div>

            <div className="order-detail-grid">
                {/* Left Column: Items */}
                <div className="order-items-section">
                    <h2>Items Ordered</h2>
                    <div className="items-list">
                        {order.items.map((item) => (
                            <div key={item._id} className="item-card">
                                <img
                                    src={item.product?.images?.[0] || "https://via.placeholder.com/80"}
                                    alt={item.name}
                                    className="item-image"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                    }}
                                />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">
                                        {formatRupiah(item.price)} x {item.quantity}
                                    </p>
                                </div>
                                <div className="item-total">
                                    {formatRupiah(item.subtotal)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-summary-box">
                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span>{formatRupiah(order.totalAmount)}</span>
                        </div>
                        {order.paymentMethod === "whatsapp" && (
                            <button
                                onClick={handleWhatsAppConfirmation}
                                className="btn whatsapp-btn"
                                style={{ width: "100%", marginTop: "1rem", gap: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                            >
                                <MessageCircle size={20} />
                                Contact Admin on WhatsApp
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Information */}
                <div className="order-info-section">
                    {/* Customer Info */}
                    <div className="info-card">
                        <h3>
                            <User size={18} />
                            Customer Details
                        </h3>
                        <div className="info-content">
                            <p><strong>Name:</strong> {order.customerName}</p>
                            <p><strong>Phone:</strong> {order.phone}</p>
                            <p><strong>Email:</strong> {order.user?.email}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="info-card">
                        <h3>
                            <MapPin size={18} />
                            Shipping Address
                        </h3>
                        <div className="info-content">
                            <p>{order.address}</p>
                            {order.notes && (
                                <div className="order-notes">
                                    <strong>Notes:</strong>
                                    <p>{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="info-card">
                        <h3>
                            <CreditCard size={18} />
                            Payment Information
                        </h3>
                        <div className="info-content">
                            <p><strong>Method:</strong> {order.paymentMethod === 'whatsapp' ? 'WhatsApp Confirmation' : order.paymentMethod}</p>
                            <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{order.paymentStatus}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
