import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pagine utenti
import CreateUserPage from "./pages/CreateUserPage";
import ListUsersPage from "./pages/ListUsersPage";

// Pagine lotterie
import CreateLotteryPage from "./pages/CreateLotteryPage";
import ListLotteryPage from "./pages/ListLotteryPage";

// Dettagli biglietti
import LotteryDetailPage from "./pages/LotteryDetailPage";

// Login/logout
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Utenti */}
          <Route path="/users" element={<ListUsersPage />} />
          <Route path="/users/create" element={<CreateUserPage />} />

          {/* Lotterie */}
          <Route path="/lotteries" element={<ListLotteryPage />} />
          <Route path="/lotteries/create" element={<CreateLotteryPage />} />
          <Route path="/lotteries/:id" element={<LotteryDetailPage />} />

          {/* Logout → semplice redirect */}
          <Route path="/logout" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}
