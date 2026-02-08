import { useState } from "react";
import Input from "../Components/Input";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

      const { data } = await api.post("/auth/login", form);

      // Simpan token dengan nama unik
      localStorage.setItem("online_marketplace_access_token", data.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "Selamat datang kembali",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      let message = "Login gagal";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Login</h2>

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

        <button disabled={loading} className="btn primary">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
