import React, { useState } from "react";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
      console.log(data);
     
    }catch (error){
      setLoading(false);
    }
  };

  return (
    <>
      <Header headerName="Sign In" />
      <div className="p-3 max-w-lg mx-auto">
        <div className="flex flex-col items-center p-3 text-center my-7">
          <h1 className="text-mainColor font-fredoka text-3xl">WelcomeHome</h1>
          <img src={logo} alt="Logo" className="h-48 w-48 mr-2" />
          <h1 className="text-3xl text-secondaryColor font-lato">
            Log in your account
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col ">
          
          <h2 className="text-secondaryColor text-2xl">Email</h2>
          <input
            type="email"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="email"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">Password</h2>
          <input
            type="password"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="password"
            onChange={handleChange}
          />
          <button disabled = {loading} className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto mt-7">
            {loading? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className="flex mt-5 gap-2">
          <p className="text-mainColor font-fredoka">No account?</p>
          <Link to={"/signin"}>
            <span className="text-mainColor font-fredoka">Sing Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
}
