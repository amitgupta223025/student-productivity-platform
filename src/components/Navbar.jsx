
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          StudyFlow
        </Link>

        <div className="flex items-center gap-5 text-sm font-semibold">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-700 hover:text-blue-600"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
