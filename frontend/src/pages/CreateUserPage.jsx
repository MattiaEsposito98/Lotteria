import { useState } from "react";
import api from "../services/api";

export default function CreateUserPage() {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    cellulare: "",
    data_nascita: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/create_user.php", form);
      if (res.data.success) {
        setMessage("✅ Utente creato con successo");
        setForm({ nome: "", cognome: "", email: "", cellulare: "", data_nascita: "" });
      } else {
        setMessage("⚠️ " + res.data.message);
      }
    } catch (err) {
      setMessage("❌ Errore nel server");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Aggiungi Utente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome *</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cognome *</label>
          <input
            type="text"
            className="form-control"
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cellulare</label>
          <input
            type="text"
            className="form-control"
            name="cellulare"
            value={form.cellulare}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data di nascita</label>
          <input
            type="date"
            className="form-control"
            name="data_nascita"
            value={form.data_nascita}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Salva</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
