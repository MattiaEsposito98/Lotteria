import { useEffect, useState } from "react";
import api from "../services/api";

export default function ListUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="container">
      <h2 className="mb-3">Lista Utenti</h2>

      {loading && <p>Caricamento...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="alert alert-warning">Nessun utente trovato</div>
      )}

      {!loading && users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
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
              {users.map((u) => (
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
      )}
    </div>
  );
}
