// pages/OrderHistoryPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    Package,
    Calendar,
    ShoppingBag,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import EmptyState from "../Components/EmptyState";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { formatRupiah } from "../helpers";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    useEffect(() => {
        fetchOrders(1);
    }, []);

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/orders?page=${page}&limit=${pagination.limit}`);

            setOrders(data.data);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Fetch orders error:", error);

            // Check if unauthorized
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Unauthorized",
                    text: "Please login to view your orders",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Load Orders",
                    text: error.response?.data?.message || "Please try again later",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchOrders(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "Menunggu Konfirmasi", color: "#f59e0b" },
            confirmed: { label: "Dikonfirmasi", color: "#3b82f6" },
            processing: { label: "Diproses", color: "#8b5cf6" },
            shipped: { label: "Dalam Pengiriman", color: "#8b5cf6" },
            delivered: { label: "Selesai", color: "#10b981" },
            cancelled: { label: "Dibatalkan", color: "#ef4444" },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span
                className="status-badge"
                style={{
                    backgroundColor: config.color,
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                }}
            >
                {config.label}
            </span>
        );
    };

    return (
        <div className="order-history-page">
            <div className="page-header">
                <h1>
                    <Package size={32} style={{ display: "inline", marginRight: "0.5rem" }} />
                    Order History
                </h1>
                <p>View all your order history</p>
            </div>

            {loading ? (
                <div
                    className="loading-state"
                    style={{ textAlign: "center", padding: "3rem" }}
                >
                    <Loader2 className="spin" size={48} style={{ margin: "0 auto" }} />
                    <p style={{ marginTop: "1rem", color: "#6b7280" }}>
                        Loading orders...
                    </p>
                </div>
            ) : orders.length > 0 ? (
                <>
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <h3>Order #{order._id}</h3>
                                        <p className="order-date">
                                            <Calendar size={16} />
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div className="order-card-body">
                                    {order.items && order.items.length > 0 && (
                                        <div className="order-items-preview">
                                            <ShoppingBag size={18} />
                                            <span>
                                                {order.items.length} item(s) •{" "}
                                                {formatRupiah(order.totalAmount || order.totalPrice || 0)}
                                            </span>
                                        </div>
                                    )}

                                    {order.shippingAddress && (
                                        <div className="order-shipping">
                                            <strong>Shipping to:</strong>
                                            <p>{order.shippingAddress.name || "N/A"}</p>
                                            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                                {order.shippingAddress.address || order.shippingAddress.street || "N/A"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="order-card-footer">
                                    <Link
                                        to={`/check-orders/${order._id}`}
                                        className="btn secondary"
                                        style={{ fontSize: "0.875rem" }}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
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
                                style={{ minWidth: "100px" }}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            className={`btn ${pagination.page === page ? "primary" : "secondary"
                                                }`}
                                            onClick={() => handlePageChange(page)}
                                            style={{
                                                minWidth: "40px",
                                                padding: "0.5rem",
                                            }}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                className="btn secondary"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                style={{ minWidth: "100px" }}
                            >
                                Next
                                <ChevronRight size={16} />
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
                        Showing {orders.length} of {pagination.total} orders
                        {pagination.pages > 1 &&
                            ` (Page ${pagination.page} of ${pagination.pages})`}
                    </div>
                </>
            ) : (
                <EmptyState
                    title="No orders yet"
                    description="You haven't placed any orders yet. Start shopping now!"
                />
            )}
        </div>
    );
}
