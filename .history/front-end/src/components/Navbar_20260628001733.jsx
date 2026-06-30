import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import {
  Bell, Sun, Moon, LogOut, ChevronDown,
  LayoutDashboard, Calendar, MessageSquare,
  Gift, Star, User, DollarSign, Users, Flag
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [demandeCount, setDemandeCount] = useState(0);
  const [offreCount, setOffreCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (user) {
      fetchBadges();
      const interval = setInterval(fetchBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchBadges = async () => {
    try {
      const notifRes = await axios.get("/notifications/unread");
      setNotifCount(notifRes.data.count || 0);

      const msgRes = await axios.get("/messages/non-lus");
      setMsgCount(msgRes.data.non_lus || 0);

      if (user?.role === "enseignant") {
        try {
          const demandesRes = await axios.get("/demandes/disponibles");
          setDemandeCount(Array.isArray(demandesRes.data) ? demandesRes.data.length : 0);
        } catch {}
      }

      if (user?.role === "etudiant") {
        try {
          const mesDemandes = await axios.get("/demandes/mes-demandes");
          let total = 0;
          for (const d of mesDemandes.data) {
            try {
              const offresRes = await axios.get(`/offres/demande/${d.id_demande}`);
              total += offresRes.data.filter((o) => o.statut === "en_attente").length;
            } catch {}
          }
          setOffreCount(total);
        } catch {}
      }
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data.slice(0, 8));
    } catch {}
  };

  const handleBellClick = async () => {
    if (!notifOpen) {
      await fetchNotifications();
      try {
        await axios.put("/notifications/read-all");
        setNotifCount(0);
      } catch {}
    }
    setNotifOpen(!notifOpen);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = user
    ? `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase()
    : "";

  const BadgeDot = ({ count }) =>
    count > 0 ? (
      <span style={{
        position: "absolute", top: "-6px", right: "-6px",
        background: "#e85d04", color: "#fff", borderRadius: "50%",
        width: "18px", height: "18px", fontSize: "10px", fontWeight: "700",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px solid #1a1a1a",
      }}>
        {count > 9 ? "9+" : count}
      </span>
    ) : null;

  return (
    <nav style={{
      background: "#1a1a1a", padding: "0 24px", height: "56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 8px rgba(0,0,0,0.15)",
    }}>
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#e85d04", fontWeight: "700", fontSize: "18px" }}>
          Learn<span style={{ color: "#fff" }}>ect</span>.ma
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <>
            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={handleBellClick}
                style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", position: "relative" }}
              >
                <Bell size={20} />
                <BadgeDot count={notifCount} />
              </button>

              {notifOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "#fff", borderRadius: "12px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  width: "340px", maxHeight: "400px", overflowY: "auto", zIndex: 200,
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #eee", fontWeight: "700", fontSize: "14px", color: "#222" }}>
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ padding: "20px 16px", color: "#888", fontSize: "13px" }}>Aucune notification.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id_notification} style={{
                        padding: "12px 16px", borderBottom: "1px solid #f5f5f5",
                        background: n.est_lue ? "#fff" : "#fff8f5",
                      }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: "1.5" }}>{n.contenu}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#aaa" }}>
                          {new Date(n.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User menu */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "#e85d04", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "13px", position: "relative",
                }}>
                  {initials}
                  {user.role === "enseignant" && (msgCount + demandeCount) > 0 && (
                    <BadgeDot count={msgCount + demandeCount} />
                  )}
                  {user.role === "etudiant" && offreCount > 0 && (
                    <BadgeDot count={offreCount} />
                  )}
                </div>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>{user.prenom}</span>
                <ChevronDown size={14} color="#aaa" />
              </button>

              {menuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "#fff", borderRadius: "12px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  minWidth: "210px", zIndex: 200, overflow: "hidden",
                }}>
                  {user.role === "etudiant" && (
                    <>
                      <NavItem to="/student" icon={<LayoutDashboard size={15} />} label="Tableau de bord" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/student/reservations" icon={<Calendar size={15} />} label="Reservations de cours" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/student/messages" icon={<MessageSquare size={15} />} label="Messagerie" badge={msgCount} onClick={() => setMenuOpen(false)} />
                      <NavItem to="/student/offres" icon={<Gift size={15} />} label="Offres et Packs" badge={offreCount} onClick={() => setMenuOpen(false)} />
                      <NavItem to="/student/requests" icon={<Star size={15} />} label="Mes Demandes" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/student/profile" icon={<User size={15} />} label="Profil Personnel" onClick={() => setMenuOpen(false)} />
                    </>
                  )}
                  {user.role === "enseignant" && (
                    <>
                      <NavItem to="/teacher" icon={<LayoutDashboard size={15} />} label="Tableau de bord" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/teacher/availability" icon={<Calendar size={15} />} label="Disponibilites" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/teacher/demandes" icon={<Users size={15} />} label="Demandes Etudiants" badge={demandeCount} onClick={() => setMenuOpen(false)} />
                      <NavItem to="/teacher/earnings" icon={<DollarSign size={15} />} label="Mes Revenus" onClick={() => setMenuOpen(false)} />
                      <NavItem to="/teacher/messages" icon={<MessageSquare size={15} />} label="Messages" badge={msgCount} onClick={() => setMenuOpen(false)} />
                      <NavItem to="/teacher/profile" icon={<User size={15} />} label="Modifier Profil" onClick={() => setMenuOpen(false)} />
                    </>
                  )}
                  {user.role === "admin" && (
                    <NavItem to="/admin" icon={<LayoutDashboard size={15} />} label="Dashboard Admin" onClick={() => setMenuOpen(false)} />
                  )}
                  <div style={{ borderTop: "1px solid #eee", margin: "4px 0" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "12px 16px",
                      background: "none", border: "none",
                      color: "#ef4444", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    <LogOut size={15} /> Deconnexion
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "6px 12px" }}>
              Connexion
            </Link>
            <Link to="/register" style={{
              background: "#e85d04", color: "#fff", textDecoration: "none",
              fontSize: "14px", fontWeight: "600", padding: "7px 16px", borderRadius: "8px",
            }}>
              S'inscrire
            </Link>
          </div>
        )}
      </div>

      {(menuOpen || notifOpen) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => { setMenuOpen(false); setNotifOpen(false); }} />
      )}
    </nav>
  );
}

function NavItem({ to, icon, label, badge = 0, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "11px 16px", color: "#333", textDecoration: "none",
      fontSize: "14px", fontWeight: "500", borderBottom: "1px solid #f5f5f5",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}{label}
      </span>
      {badge > 0 && (
        <span style={{
          background: "#e85d04", color: "#fff", borderRadius: "50%",
          width: "18px", height: "18px", fontSize: "10px", fontWeight: "700",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}