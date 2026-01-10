import { NavLink, Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { getAvatarUrl } from "~/lib/utils/auth";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="w-full px-8 text-gray-700 bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex flex-col md:flex-row items-center justify-between py-5 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <NavLink to="/" className="flex items-center mb-5 md:mb-0">
            <span className="text-xl font-black text-gray-900 select-none">
              🌍 Country<span className="text-indigo-600">Explorer</span>
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center ml-0 md:ml-8 md:border-l md:pl-8">
            <NavLink
              to="/"
              end
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </NavLink>
            <NavLink
              to="/countries"
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              Countries
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/profile"
                  className="mr-5 font-medium text-gray-600 hover:text-gray-900"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/stats"
                  className="mr-5 font-medium text-gray-600 hover:text-gray-900"
                >
                  Stats
                </NavLink>
              </>
            )}
            <NavLink
              to="/about"
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              About
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <img
                src={getAvatarUrl(user.username)}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium text-gray-700">{user.username}</span>
              <span className="text-yellow-500">⭐ {user.totalPoints}</span>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
