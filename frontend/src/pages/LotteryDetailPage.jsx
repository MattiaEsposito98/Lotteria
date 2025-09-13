import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import UserSearch from "../components/UserSearch";


export default function LotteryDetailPage() {
  const { id } = useParams(); // id lotteria preso dall'URL
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");


  // Carica biglietti
  const loadTickets = async () => {
    try {
      const res = await api.get(`/list_tickets.php?id_lotteria=${id}`);
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    loadTickets().then(() => setLoading(false));
  }, []);


  // Aggiungi biglietto
  const addTicket = async () => {
    if (!selectedUser) {
      setMessage("⚠️ Seleziona un utente");
      return;
    }
    try {
      const res = await api.post("/assign_tickets.php", {
        id_lotteria: id,
        id_utente: selectedUser,
      });
      if (res.data.success) {
        setMessage("✅ Biglietto generato: " + res.data.codice);
        loadTickets(); // ricarica lista
      } else {
        setMessage("⚠️ " + res.data.message);
      }
    } catch (err) {
      setMessage("❌ Errore server");
    }
  };

  if (loading) return <div className="container">Caricamento...</div>;

  return (
    <div className="container">
      <h2 className="mb-3">Dettagli Lotteria #{id}</h2>

      {/* Form aggiunta biglietto */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Aggiungi Biglietto</h5>
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <UserSearch onSelect={(u) => setSelectedUser(u.id)} />
            </div>
            <div className="col-md-3">
              <button onClick={addTicket} className="btn btn-success mt-2">
                + Aggiungi Biglietto
              </button>
            </div>
          </div>

          {/* 🔎 Filtro biglietti */}
          <div className="mt-4">
            <label className="form-label">Filtra biglietti</label>
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per nome, cognome o codice..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>

      {/* Lista biglietti */}
      <h4>Biglietti assegnati</h4>
      {
        tickets.length === 0 ? (
          <div className="alert alert-warning">Nessun biglietto ancora generato</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Codice</th>
                  <th>Utente</th>
                  <th>Email</th>
                  <th>Data creazione</th>
                </tr>
              </thead>
              <tbody>
                {tickets
                  .filter((t) => {
                    const term = filter.toLowerCase();
                    return (
                      (t.nome || "").toLowerCase().includes(term) ||
                      (t.cognome || "").toLowerCase().includes(term) ||
                      (t.codice || "").toLowerCase().includes(term)
                    );
                  })
                  .map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td><strong>{t.codice}</strong></td>
                      <td>{t.nome} {t.cognome}</td>
                      <td>{t.email || "-"}</td>
                      <td>{t.created_at}</td>
                    </tr>
                  ))}

              </tbody>
            </table>
          </div>
        )
      }
    </div >
  );
}
