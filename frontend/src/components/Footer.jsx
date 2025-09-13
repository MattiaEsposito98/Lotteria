export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      <div className="container">
        <small>© {new Date().getFullYear()} Lotteria Admin Panel</small>
      </div>
    </footer>
  );
}
