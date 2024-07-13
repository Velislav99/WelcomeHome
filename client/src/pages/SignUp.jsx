import React from "react";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <>
      <Header headerName="SignUp" />
      <div className="p-3 max-w-lg mx-auto">
        <div className="flex flex-col items-center p-3 text-center my-7">
          <h1 className="text-mainColor font-fredoka text-3xl">WelcomeHome</h1>
          <img src={logo} alt="Logo" className="h-48 w-48 mr-2" />
          <h1 className="text-3xl text-secondaryColor font-lato">
            Create your account
          </h1>
        </div>
        <form className="flex flex-col ">
          <h2 className="text-secondaryColor text-2xl">Username</h2>
          <input
            type="text"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="username"
          />
          <h2 className="text-secondaryColor text-2xl">Email</h2>
          <input
            type="email"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="email"
          />
          <h2 className="text-secondaryColor text-2xl">Password</h2>
          <input
            type="password"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="password"
          />
          <button className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto mt-7">Sign Up</button>
        </form>
        <div className="flex mt-5 gap-2">
          <p className="text-mainColor font-fredoka">Have an account?</p>
          <Link to={"/signin"}>
            <span className="text-mainColor font-fredoka">Sign In</span>
          </Link>
        </div>
      </div>
    </>
  );
}
