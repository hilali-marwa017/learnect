import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
        <div className="container">

          {/* LOGO */}
          <Link className="navbar-brand fw-bold text-success" to="/">
            Learnecr
          </Link>

          {/* TOGGLE */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LINKS */}
          <div className="collapse navbar-collapse" id="nav">

            <ul className="navbar-nav ms-auto align-items-lg-center gap-2">

              <li className="nav-item">
                <Link className="nav-link text-dark" to="/">
                  Accueil
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-dark" to="/login">
                  Se connecter
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-success text-white px-3" to="/dashboard">
                  Devenir Pro
                </Link>
              </li>

            </ul>

          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="container flex-grow-1 mt-4">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="text-center py-3 border-top bg-light">
        © 2026 SuperApp - Tous droits réservés
      </footer>

    </div>
  );
}

export default Layout;