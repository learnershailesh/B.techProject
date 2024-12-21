import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProtectedRoute = (route) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(route);
    }
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-2xl p-2">
              <div className="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                BlockEstate
              </div>
              <span className="hidden sm:inline">RealEstate DApp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleProtectedRoute("/")}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => handleProtectedRoute("/properties")}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Properties
            </button>
            <button
              onClick={() => handleProtectedRoute("/add-property")}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Add Property
            </button>
            <button
              onClick={() => handleProtectedRoute("/about")}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              About Us
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleProtectedRoute("/")}
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
          >
            Home
          </button>
          <button
            onClick={() => handleProtectedRoute("/properties")}
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
          >
            Properties
          </button>
          <button
            onClick={() => handleProtectedRoute("/add-property")}
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
          >
            Add Property
          </button>
          <button
            onClick={() => handleProtectedRoute("/about")}
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
          >
            About Us
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-white bg-green-500 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
