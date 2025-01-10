// GENAI Citation: Used to create styling for header, along with useUser usage and routing.

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../api/user/userLogout";
import { UserProvider, useUser } from "../../api/user/userContext";

const HeaderInterior: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check for role in localStorage and update admin status
    const role = localStorage.getItem("role");
    setIsAdmin(role === "ADMIN");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-semibold">
          <a href="/home" className="text-white hover:text-gray-400">
            Scriptorium
          </a>
        </div>

        {/* Navigation Links */}
        <nav
          className={`md:flex space-x-6 ${mobileMenuOpen ? "block" : "hidden"} md:block`}
        >
          <a href="/blogList" className="hover:text-gray-400">
            Blogs
          </a>
          <a href="/templateList" className="hover:text-gray-400">
            Templates
          </a>
          {isAdmin && (
            <a href="/admin" className="hover:text-gray-400">
              Admin Panel
            </a>
          )}
        </nav>

        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <span className="hidden md:inline-block">{user.firstName} {user.lastName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10">
                  <a
                    href="/viewProfile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <button
                    onClick={() => logout(router)}
                    className="block px-4 py-2 hover:bg-gray-100 text-left w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => router.push("/userLogin")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Search */}
      {mobileMenuOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center px-4 mt-2 space-x-2 md:hidden"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
          />
          <button
            type="submit"
            className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 focus:ring focus:ring-gray-500"
          >
            Search
          </button>
        </form>
      )}
    </header>
  );
};

const Header: React.FC = () => {
  return (
    <UserProvider>
      <HeaderInterior />
    </UserProvider>
  );
};

export default Header;
