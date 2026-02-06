import Input from "../Components/Input";

export default function RegisterPage() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="auth-page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Register</h2>
        <Input label="Username" required error="Test error test" />
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <button className="btn primary">Register</button>
      </form>
    </div>
  );
}
