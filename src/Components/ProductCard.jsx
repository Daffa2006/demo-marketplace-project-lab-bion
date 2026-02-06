import { formatRupiah } from "../helpers";

export default function ProductCard({
  name,
  category,
  image,
  stock,
  price,
  isFeatured,
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
      </div>
    </figure>
  );
}
