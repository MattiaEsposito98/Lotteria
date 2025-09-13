import { useState } from "react";
import api from "../services/api";

export default function CreateLotteryPage() {
  const [form, setForm] = useState({
    titolo: "",
    descrizione: "",
    data_inizio: "",
    data_fine: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/create_lotteria.php", form);
      if (res.data.success) {
        setMessage("✅ Lotteria creata con successo");
        setForm({ titolo: "", descrizione: "", data_inizio: "", data_fine: "" });
      } else {
        setMessage("⚠️ " + res.data.message);
      }
    } catch (err) {
      setMessage("❌ Errore server");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Crea Lotteria</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titolo *</label>
          <input
            type="text"
            className="form-control"
            name="titolo"
            value={form.titolo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrizione</label>
          <textarea
            className="form-control"
            name="descrizione"
            value={form.descrizione}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Data inizio *</label>
          <input
            type="date"
            className="form-control"
            name="data_inizio"
            value={form.data_inizio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data fine *</label>
          <input
            type="date"
            className="form-control"
            name="data_fine"
            value={form.data_fine}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Crea</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
