import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" }
  ];

  return (
    <div className="w-full px-6 py-3 bg-white flex justify-between items-center fixed top-0 z-20 shadow-md">
      {/* Logo */}
      <div>
        <img src="./smartSchoolTracker.jpg" alt="logo" className="h-14 w-14" />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6 text-lg text-gray-700 font-medium">
        {navLinks.map(({ name, path }) => (
          <li key={name}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `hover:text-sky-600 ${isActive ? 'border-b-2 border-blue-600' : ''}`
              }
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden z-30" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-white shadow-md transition-all duration-300 ${menuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col items-center gap-4 py-4 text-gray-700 text-lg font-medium">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `hover:text-sky-600 ${isActive ? 'border-b-2 border-blue-600' : ''}`
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
