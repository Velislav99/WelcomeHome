import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-warp">
            <label className="whitespace-nowrap font-semibold">Gender:</label>
            <div>
              <input type="checkbox" id="all" className="w-5" />
              <span>Male and Female</span>
            </div>
            <div>
              <input type="checkbox" id="male" className="w-5" />
              <span>Male</span>
            </div>
            <div>
              <input type="checkbox" id="female" className="w-5" />
              <span>Female</span>
            </div>
          </div>
          <div>
            <input type="checkbox" id="vaccinations"  />
            <span className="ml-1 font-semibold">Vaccinations</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3">
                <option>Age</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>

          <button className="bg-mainColor text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl font-fredoka p-3 border-b text-mainColor mt-5">Results:</h1>
      </div>
    </div>
  );
}
