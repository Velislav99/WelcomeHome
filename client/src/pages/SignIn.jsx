import React, { useState } from "react";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
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
          <div className="flex">
            <button
              disabled={loading}
              className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto m-3"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            <OAuth />
          </div>
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
