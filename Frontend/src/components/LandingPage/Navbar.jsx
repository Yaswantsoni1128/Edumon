import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='w-full px-10 py-2 bg-white flex justify-between items-center fixed z-10 shadow-md '>
      <div>
        <img src="./smartSchoolTracker.jpg" alt="logo" className='h-18 w-18' />
      </div>
      <div>
        <ul className='flex justify-between items-center gap-5 text-lg text-gray-700 font-medium'>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-sky-600 ${isActive ? "border-b-2 border-blue-600" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-sky-600 ${isActive ? "border-b-2 border-blue-600" : ""}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `hover:text-sky-600 ${isActive ? "border-b-2 border-blue-600" : ""}`
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-sky-600 ${isActive ? "border-b-2 border-blue-600" : ""}`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
