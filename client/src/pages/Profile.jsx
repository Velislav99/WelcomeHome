import React from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux"

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <Header headerName="Profile" />
      <div className="p3 max-w-lg mx-auto">
        <h1 className="text-3xl font-fredoka text-mainColor m-2 text-center">
          WelcomeHome
        </h1>
        <form className="flex flex-col ">
          <img
            src={currentUser?.avatar}
            alt="Avatar"
            className="w-40 h-40 rounded-full mx-auto object-cover cursor-pointer"
          />
          <h2 className="text-secondaryColor text-2xl">Username:</h2>
          <input
            type="text"
            placeholder={currentUser?.username}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="username"
          />
          <h2 className="text-secondaryColor text-2xl">Email:</h2>
          <input
            type="email"
            placeholder={currentUser?.email}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="email"
          />
          <h2 className="text-secondaryColor text-2xl">City:</h2>
          <input
            type="text"
            placeholder={currentUser?.city}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="city"
          />
          <h2 className="text-secondaryColor text-2xl">About me:</h2>
          <input
            type="text"
            placeholder={currentUser?.aboutme}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="aboutme"
          />
          <h2 className="text-secondaryColor text-2xl">Password</h2>
          <input
            type="text"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="password"
          />
          <div className="flex">
            <button className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto m-3">
              Update
            </button>
            <button className="flex justify-center items-center p-3 rounded-lg bg-white border-2 border-mainColor m-3 w-48 mx-auto text-mainColor">
              Create H2sting
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </div>
    </>
  );
}
