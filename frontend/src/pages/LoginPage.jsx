import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const cleanForm = {
        email: form.email.trim(),
        password: form.password.trim(),
      };

      console.log("Invio login:", cleanForm);

      const res = await api.post("/login.php", cleanForm);
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/users"); // vai alla dashboard
      } else {
        console.log("Login response:", res.data);
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Errore login");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">Login Admin</h3>
      <form onSubmit={doLogin}>
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
