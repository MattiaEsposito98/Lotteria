import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/users">Lotteria Admin</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            {/* Utenti */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Utenti
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/users/create">
                    Aggiungi Utente
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/users">
                    Lista Utenti
                  </Link>
                </li>
              </ul>
            </li>

            {/* Lotterie */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Lotterie
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/lotteries/create">
                    Crea Lotteria
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/lotteries">
                    Lista Lotterie
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Logout */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
