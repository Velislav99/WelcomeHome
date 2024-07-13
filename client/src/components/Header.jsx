import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { FaSearch, FaRegBell, FaUser } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Header({ headerName }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pages = ["Profile", "Help", "SignIn", "SignUp"];
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="border-b border-secondaryColor shadow-sm shadow-gray-500">
      <div className="flex justify-between items-center p-3">
        <Link to="/">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-sm sm:text-xl flex flex-wrap">
              <span className="text-mainColor font-fredoka">{headerName}</span>
            </h1>
          </div>
        </Link>
        <form className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-12 sm:w-64"
          />
          <FaSearch className="text-gray-400 ml-2" />
        </form>
        <div className="flex items-center">
          <AiOutlineMessage className="text-mainColor mr-4" fontSize={24} />
          <FaRegBell className="text-mainColor mr-4" fontSize={24} />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none flex items-center"
            >
              <FaUser className="text-mainColor" fontSize={24} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {pages.map((page) => (
                  <Link to={`/${page.toLocaleLowerCase()}`}>
                    <a
                      key={page}
                      className="block px-4 py-2 text-mainColor hover:bg-gray-100"
                    >
                      {page}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
