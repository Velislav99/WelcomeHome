import { set } from "mongoose";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    gender: "all",
    vaccinations: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const genderFromUrl = urlParams.get("gender");
    const vaccinationsFromUrl = urlParams.get("vaccinations");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      genderFromUrl ||
      vaccinationsFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        gender: genderFromUrl || "all",
        vaccinations: vaccinationsFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      }else if (data.length < 9) {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "male" ||
      e.target.id === "female"
    ) {
      setSidebarData({ ...sidebarData, gender: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "vaccinations") {
      setSidebarData({
        ...sidebarData,
        vaccinations: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("gender", sidebarData.gender);
    urlParams.set("vaccinations", sidebarData.vaccinations);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 flex-warp">
            <label className="whitespace-nowrap font-semibold">Gender:</label>
            <div>
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.gender === "all"}
              />
              <span>Male and Female</span>
            </div>
            <div>
              <input
                type="checkbox"
                id="male"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.gender === "male"}
              />
              <span>Male</span>
            </div>
            <div>
              <input
                type="checkbox"
                id="female"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.gender === "female"}
              />
              <span>Female</span>
            </div>
          </div>
          <div>
            <input
              type="checkbox"
              id="vaccinations"
              onChange={handleChange}
              checked={sidebarData.vaccinations}
            />
            <span className="ml-1 font-semibold">Vaccinations</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
              <option value={"age_asc"}>Age</option>
            </select>
          </div>

          <button className="bg-mainColor text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-fredoka p-3 border-b text-mainColor mt-5">
          Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-5">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-mainColor ">No listings found</p>
          )}

          {loading && (
            <p className="text-xl text-mainColor text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && !loading && listings.length > 0 && (
            <div className="w-full flex justify-center">
              <button
                className="bg-mainColor text-white p-3 rounded-lg hover:opacity-95"
                onClick={onShowMoreClick}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
