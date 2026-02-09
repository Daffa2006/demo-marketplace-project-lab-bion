import { useState, useEffect } from "react";
import { Loader2, UserCircle2, Mail, Shield } from "lucide-react";
import { getInitials } from "../helpers";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import api from "../lib/axios";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile");
      setUser(data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Profile",
        text: error.response?.data?.message || "Please try again later",
      });

      // If token invalid, logout and redirect to login
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      {loading ? (
        <div className="profile-loader">
          <Loader2 className="spin" size={32} />
        </div>
      ) : user ? (
        <div className="profile-card">
          {/* Avatar */}
          <div
            style={{ alignSelf: "center", scale: "1.5" }}
            className="avatar-circle"
          >
            {getInitials(user.name)}
          </div>

          {/* Info */}
          <div className="profile-table">
            <div className="row">
              <span className="label">
                <UserCircle2 size={28} /> Name
              </span>
              <span className="value">{user.name}</span>
            </div>

            <div className="row">
              <span className="label">
                <Mail size={28} /> Email
              </span>
              <span className="value">{user.email}</span>
            </div>

            <div className="row">
              <span className="label">
                <Shield size={28} /> Role
              </span>
              <span className="value badge">{user.role}</span>
            </div>
          </div>

          <button className="btn destructive logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="profile-card">
          <p>Failed to load profile data</p>
        </div>
      )}
    </div>
  );
}
