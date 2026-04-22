import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">MyApp</Link>

          <button className="navbar-toggler"type="button"data-bs-toggle="collapse"data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/">Dark Mode</Link>

              </li>

            </ul>
          </div>

        </div>
      </nav>

      <main className="container mt-4 flex-grow-1">
        <Outlet /> {/* !! */}
      </main>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        © 2026 MyApp - All rights reserved
      </footer>

    </div>
  );
}

export default Layout;