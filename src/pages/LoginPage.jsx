import Input from "../Components/Input";

export default function LoginPage() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="auth-page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Register</h2>
        {/* Kalau error */}
        {/* <span className="auth-error">Email atau password error</span> */}
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <button className="btn primary">Register</button>
      </form>
    </div>
  );
}
