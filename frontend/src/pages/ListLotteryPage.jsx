import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function ListLotteryPage() {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carica tutte le lotterie
  const loadLotteries = async () => {
    try {
      const res = await api.get("/list_lotteries.php");
      if (res.data.success) {
        setLotteries(res.data.lotteries);
      } else {
        setError("⚠️ " + res.data.message);
      }
    } catch (err) {
      setError("❌ Errore nel caricamento lotterie");
    } finally {
      setLoading(false);
    }
  };

  // Aggiorna stato lotteria
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.post("/update_lottery_status.php", {
        id,
        stato: newStatus,
      });
      if (res.data.success) {
        setLotteries((prev) =>
          prev.map((l) => (l.id === id ? { ...l, stato: newStatus } : l))
        );
      } else {
        alert("Errore: " + res.data.message);
      }
    } catch (err) {
      alert("❌ Errore server");
    }
  };

  useEffect(() => {
    loadLotteries();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-3">Lista Lotterie</h2>

      {loading && <p>Caricamento...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && lotteries.length === 0 && (
        <div className="alert alert-warning">Nessuna lotteria trovata</div>
      )}

      {!loading && lotteries.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titolo</th>
                <th>Descrizione</th>
                <th>Data inizio</th>
                <th>Data fine</th>
                <th>Stato</th>
                <th>Creato il</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {lotteries.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.titolo}</td>
                  <td>{l.descrizione || "-"}</td>
                  <td>{l.data_inizio}</td>
                  <td>{l.data_fine}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm ${l.stato === "aperta" ? "text-success" : "text-danger"
                        }`}
                      value={l.stato}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                    >
                      <option value="aperta">Aperta</option>
                      <option value="chiusa">Chiusa</option>
                    </select>
                  </td>
                  <td>{l.created_at}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-primary"
                      to={`/lotteries/${l.id}`}
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
