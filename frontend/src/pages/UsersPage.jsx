import { useEffect, useState } from "react";
import api from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "" });

  const loadUsers = async () => {
    const res = await api.get("/list_users.php");
    if (res.data.success) setUsers(res.data.data);
  };

  const createUser = async (e) => {
    e.preventDefault();
    const res = await api.post("/create_user.php", form);
    if (res.data.success) {
      setForm({ nome: "", email: "" });
      loadUsers();
    } else {
      alert(res.data.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gestione Utenti</h2>

      <form className="row g-3 mb-4" onSubmit={createUser}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">
            Aggiungi
          </button>
        </div>
      </form>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th>Creato il</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>
                <span className="badge bg-secondary">{u.ruolo}</span>
              </td>
              <td>{u.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
