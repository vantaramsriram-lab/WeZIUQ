import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth()
  const navigate = useNavigate();
  const navLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Questions", path: "/admin/questions" },
    { name: "Results", path: "/admin/results" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">


      <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6 py-9">

        {/* Logo */}

        <h1 className="text-[38px] font-bold tracking-wider">
          <span style={{ color: "var(--text-primary)" }}>
            We
          </span>

          <span style={{ color: "var(--primary)" }}>
            ZIUQ
          </span>
        </h1>


        {/* Logout */}
        <div className="flex gap-10 items-center">
          <h2 className="hidden sm:block text-xl font-medium text-black tracking-wide">Hello! {user?.name || "Admin"}</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--border)] hover:bg-gray-50 transition" onClick={() => { navigate("/auth") }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>

            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="mx-auto px-6 py-8 md:px-30">

        {/* Navigation Links */}
        <div className="w-full sm:gap-10 gap-5 flex mb-10 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-lg w-fit font-medium transition ${isActive
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-gray-600 border border-[var(--border)] hover:text-[var(--primary)]"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Pages */}
        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;