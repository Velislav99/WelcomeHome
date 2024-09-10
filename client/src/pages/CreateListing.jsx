import React from "react";
import Header from "../components/Header";

export default function CreateListing() {
  return (
    <>
      <Header headerName="Create Listing" />
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-fredoka text-mainColor text-center my-7">
          Create Listing
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 ">
            <input
              type="text"
              placeholder="Name"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="name"
              maxLength="62"
              minLength="3"
              required
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="description"
              maxLength="500"
              minLength="50"
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="address"
              maxLength="62"
              minLength="10"
              required
            />

            <div className="flex flex-wrap sm:flex-row gap-3 ">
              <input
                type="text"
                placeholder="Age"
                className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1"
                id="age"
                required
              />
              <input
                type="text"
                placeholder="Breed"
                className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1 "
                id="breed"
                required
              />
              <input
                type="text"
                placeholder="Gender"
                className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1"
                id="gender"
                required
              />
            </div>

            <div>
              <input
                type="checkbox"
                className="w-5"
                id="vaccinations"
                required
              />
              <span className="ml-2 text-secondaryColor">Vaccinations</span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <p className="font-semibold">Images:
                <span className="font-normal text-gray-600 ml-2 ">The first image will be the cover (max 6)</span>
            </p>
            <div className="flex gap-3">
              <input className="p-3 border border-gray-300 rounded w-full" type="file" id='images' accept="image/*" multiple/>  
              <button className="p-3 bg-mainColor text-white rounded uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
            </div>
          </div>
          <button className="p-3 bg-mainColor text-white rounded uppercase hover:shadow-lg">Create Listing</button>
        </form>
      </main>
    </>
  );
}
