import { useEffect, useState } from "react";
import api from "../services/api";

export default function ListUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(""); // 🔎 filtro ricerca
  const [page, setPage] = useState(1); // 📄 pagina corrente
  const perPage = 10; // 🔢 quanti utenti per pagina

  const loadUsers = async () => {
    try {
      const res = await api.get("/list_users.php");
      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        setError("⚠️ " + res.data.message);
      }
    } catch (err) {
      setError("❌ Errore nel caricamento utenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔎 Filtra utenti
  const filtered = users.filter((u) => {
    const term = filter.toLowerCase();
    return (
      (u.nome || "").toLowerCase().includes(term) ||
      (u.cognome || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.cellulare || "").toLowerCase().includes(term)
    );
  });


  // 📄 Calcola paginazione
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista Utenti</h2>
        {/* 🔎 filtro ricerca a destra */}
        <div style={{ maxWidth: "250px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cerca..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1); // reset pagina quando cerchi
            }}
          />
        </div>
      </div>

      {loading && <p>Caricamento...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && paginated.length === 0 && (
        <div className="alert alert-warning">Nessun utente trovato</div>
      )}

      {!loading && paginated.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Email</th>
                  <th>Cellulare</th>
                  <th>Data di nascita</th>
                  <th>Creato il</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nome}</td>
                    <td>{u.cognome}</td>
                    <td>{u.email || "-"}</td>
                    <td>{u.cellulare || "-"}</td>
                    <td>{u.data_nascita || "-"}</td>
                    <td>{u.created_at}</td>
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
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    «
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
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
