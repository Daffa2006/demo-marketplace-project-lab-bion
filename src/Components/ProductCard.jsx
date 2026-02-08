import { Pencil, Trash2 } from "lucide-react";
import { formatRupiah } from "../helpers";

export default function ProductCard({
  name,
  category,
  image,
  stock,
  price,
  isFeatured,
  onEdit,
  onDelete,
}) {
  return (
    <figure className="product-card">
      <img className="product-content" src={image} alt={"Foto produk" + name} />
      <div className="product-information">
        {/* Product Category */}
        <div className="product-tags">
          <small className="product-category">{category}</small>
          {isFeatured && <small className="featured-badge">Featured</small>}
        </div>
        {/* Product Name */}
        <figcaption className="product-name">{name}</figcaption>
        {/* Price and stock */}
        <div className="product-price-stock">
          <span>{formatRupiah(price)}</span>
          <span>{stock} Tersisa</span>
        </div>
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          <button
            onClick={onEdit}
            aria-label="Edit produk"
            style={{
              padding: "8px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#3b82f6",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3b82f6")
            }
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={onDelete}
            aria-label="Hapus produk"
            style={{
              padding: "8px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#ef4444",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc2626")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ef4444")
            }
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </figure>
  );
}
