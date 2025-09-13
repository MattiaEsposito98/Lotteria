import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Lotteria Admin</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Lotteria dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="lotteryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Lotteria
              </a>
              <ul className="dropdown-menu" aria-labelledby="lotteryDropdown">
                <li><Link className="dropdown-item" to="/create-lottery">Crea lotteria</Link></li>
                <li><Link className="dropdown-item" to="/list-lottery">Lista lotterie</Link></li>
              </ul>
            </li>

            {/* Utenti dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="usersDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Utenti
              </a>
              <ul className="dropdown-menu" aria-labelledby="usersDropdown">
                <li><Link className="dropdown-item" to="/create-user">Aggiungi utente</Link></li>
                <li><Link className="dropdown-item" to="/list-users">Lista utenti</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
