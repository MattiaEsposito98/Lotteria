import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pagine
import CreateLotteryPage from "./pages/CreateLotteryPage";
import ListLotteryPage from "./pages/ListLotteryPage";
import CreateUserPage from "./pages/CreateUserPage";
import ListUsersPage from "./pages/ListUsersPage";

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container my-4 flex-grow-1">
          <Routes>
            <Route path="/create-lottery" element={<CreateLotteryPage />} />
            <Route path="/list-lottery" element={<ListLotteryPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
            <Route path="/list-users" element={<ListUsersPage />} />
            <Route path="/" element={<h2>Benvenuto nel pannello admin</h2>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
