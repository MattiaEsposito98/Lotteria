import { useState } from "react";
import api from "../services/api";

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/search_users.php?q=${value}`);
      if (res.data.success) {
        setResults(res.data.users);
      }
    } catch (err) {
      console.error("Errore ricerca utenti", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-search">
      <input
        type="text"
        className="form-control"
        placeholder="Digita almeno 3 lettere..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading && <div>⏳ Ricerca...</div>}
      {results.length > 0 && (
        <ul className="list-group mt-2">
          {results.map((u) => (
            <li
              key={u.id}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => {
                onSelect(u); // callback per restituire l'utente scelto
                setQuery(`${u.nome} ${u.cognome}`);
                setResults([]);
              }}
            >
              {u.nome} {u.cognome} {u.email && <small>({u.email})</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
