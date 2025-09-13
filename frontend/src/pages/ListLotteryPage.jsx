import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function ListLotteryPage() {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // 👈 ID della lotteria in editing
  const [filter, setFilter] = useState(""); // 🔎 filtro ricerca
  const [page, setPage] = useState(1); // 📄 pagina corrente
  const perPage = 10;

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
      console.error("Errore updateStatus:", err);
      alert("❌ Errore server");
    }
  };

  useEffect(() => {
    loadLotteries();
  }, []);

  // 🔎 Filtra lotterie
  const filtered = lotteries.filter((l) => {
    const term = filter.toLowerCase();
    return (
      (l.titolo || "").toLowerCase().includes(term) ||
      (l.descrizione || "").toLowerCase().includes(term) ||
      (l.stato || "").toLowerCase().includes(term)
    );
  });

  // 📄 Paginazione
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="container">
      {/* Titolo + filtro a destra */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista Lotterie</h2>
        <div style={{ maxWidth: "250px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cerca per titolo, descrizione o stato..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1); // reset alla prima pagina
            }}
          />
        </div>
      </div>

      {loading && <p>Caricamento...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && paginated.length === 0 && (
        <div className="alert alert-warning">Nessuna lotteria trovata</div>
      )}

      {!loading && paginated.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
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
                {paginated.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.titolo}</td>
                    <td>{l.descrizione || "-"}</td>
                    <td>{l.data_inizio}</td>
                    <td>{l.data_fine}</td>
                    <td>
                      {editingId === l.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={l.stato}
                          onChange={(e) => {
                            updateStatus(l.id, e.target.value);
                            setEditingId(null);
                          }}
                          onBlur={() => setEditingId(null)}
                          autoFocus
                        >
                          <option value="aperta">Aperta</option>
                          <option value="chiusa">Chiusa</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${l.stato === "aperta" ? "bg-success" : "bg-danger"
                            }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setEditingId(l.id)}
                        >
                          {l.stato === "aperta" ? "Aperta" : "Chiusa"}
                        </span>
                      )}
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

          {/* 📄 Navigazione pagine in basso a destra */}
          <div className="d-flex justify-content-end mt-3">
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    «
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    »
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
