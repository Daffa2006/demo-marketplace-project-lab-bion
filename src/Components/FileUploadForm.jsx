import { ImagePlus } from "lucide-react";
import { useState, useRef } from "react";

export default function FileUploadForm(props) {
  const { oldImage, setSaveImage, name, label, error } = props;
  const [image, setImage] = useState();
  const fileRef = useRef();

  function handleUploadChange(e) {
    let uploaded = e.target.files[0];
    setImage(URL.createObjectURL(uploaded));
    console.log(uploaded);
    setSaveImage(uploaded);
  }
  return (
    <div className="mb-4">
      {image || oldImage ? (
        <img
          src={image || oldImage}
          className="preview-image"
          alt="Foto produk"
        />
      ) : (
        <div onClick={() => fileRef.current.click()} className="preview-image">
          <ImagePlus />
        </div>
      )}
      <label htmlFor={name}>{label}</label>
      <input
        ref={fileRef}
        className={error && "input-error"}
        onChange={handleUploadChange}
        type="file"
        id={name}
        accept="image/*"
      />
      <span className="error-message">{error}</span>
    </div>
  );
}
