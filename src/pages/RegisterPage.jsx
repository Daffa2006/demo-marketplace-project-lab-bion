import { useState } from "react";
import Input from "../Components/Input";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", form);

      Swal.fire({
        icon: "success",
        title: "Register Success",
        text: "Account berhasil dibuat",
      });

      // Simpan token untuk auto-login
      localStorage.setItem("online_marketplace_access_token", data.data.token);

      // Simpan user data untuk ditampilkan di navbar
      localStorage.setItem("online_marketplace_user", JSON.stringify({
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
      }));

      // Auto-login: redirect ke home page
      navigate("/");
    } catch (error) {
      let message = "Terjadi kesalahan";

      if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).flat().join("\n");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Register Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Register</h2>

        <Input
          label="Username"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirm Password"
          name="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        <button disabled={loading} className="btn primary">
          {loading ? "Loading..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Sudah punya akun?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
