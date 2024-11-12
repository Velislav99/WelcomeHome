import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { FaSearch, FaRegBell, FaUser } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header({ headerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
  }, []);

  function NavLinks() {
    return (
      <>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/help">Help</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </>
    );
  }

  return (
    <header className="bg-white sticky top-0 z-[20] mx-auto flex flex-wrap justify-between items-center p-3">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
        </Link>
        <h1 className="text-sm sm:text-xl flex flex-wrap">
          <span className="text-mainColor font-fredoka">{headerName}</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent focus:outline-none w-12 sm:w-32"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <FaSearch className="text-gray-400 ml-2" />
        </button>
      </form>
      <nav className=" flex justify-end">
        <div className="hidden justify-between md:flex gap-4 text-mainColor font-fredoka text-xl">
          <NavLinks />
          <div className="">
            {currentUser ? (
              <div className="flex">
                <AiOutlineMessage
                  className="text-mainColor mr-4"
                  fontSize={24}
                />
                <FaRegBell className="text-mainColor mr-4" fontSize={24} />

                <Link to="/profile">
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full "
                  />
                </Link>
              </div>
            ) : (
              <Link to="/signin">
                <span className="bg-mainColor text-white rounded-xl p-2 font-fredoka text-2xl">
                  SignIn
                </span>
              </Link>
            )}
          </div>
        </div>
        <div className="md:hidden flex">
          {currentUser && (
            <div className="flex items-center">
              <AiOutlineMessage className="text-mainColor mr-4" fontSize={24} />
              <FaRegBell className="text-mainColor mr-4" fontSize={24} />
            </div>
          )}
          <button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {isOpen && (
        <div className="flex flex-col items-center basis-full text-mainColor font-fredoka text-3xl ">
          <NavLinks />
          {currentUser ? (
            <NavLink to="/profile">Profile</NavLink>
          ) : (
            <NavLink to="/signin" className="bg-mainColor text-white rounded-2xl p-2">SignIn</NavLink>
          )}
        </div>
      )}
    </header>
  );
}
