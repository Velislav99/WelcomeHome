import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!listing) return;

      try {
        const response = await fetch(
          `/api/listing/get?limit=4&searchTerm=${listing.breed}&sort=random`
        );
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching recent listings:", error);
      }
    };

    fetchListings();
  }, [listing]);

  return (
    <div className="flex flex-col justify-center">
      <main>
        {loading && (
          <p className="text-center my-7 text-2xl font-fredoka text-mainColor">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center my-7 text-2xl font-fredoka text-mainColor">
            Something went wrong...
          </p>
        )}
        {listing && !loading && !error && (
          <div className="max-w-4xl mx-auto">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link copied!
              </p>
            )}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className="text-2xl font-semibold">{listing.name}</p>
              <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-mainColor" />
                {listing.address}
              </p>
              <div className="flex items-center gap-2">
                {listing.gender === "male" ? (
                  <p className="bg-blue-500 text-white text-center p-1 rounded-md">
                    Male
                  </p>
                ) : (
                  <p className="bg-pink-500 text-white text-center p-1 rounded-md">
                    Female
                  </p>
                )}

                {listing.vaccinations === true ? (
                  <p className="bg-mainColor text-white text-center p-1 rounded-md">
                    Vaccinated
                  </p>
                ) : (
                  <p className="bg-red-500 text-white text-center p-1 rounded-md">
                    Not Vaccinated
                  </p>
                )}
              </div>
              <h1 className="font-fredoka text-mainColor">Description</h1>
              <p className="text-slate-800">{listing.description}</p>
              <div className="flex gap-2">
                <h1 className="font-fredoka text-mainColor">Breed:</h1>
                <p>{listing.breed}</p>
                <h1 className="font-fredoka text-mainColor">Age:</h1>
                <p>{listing.age}</p>
              </div>
              <button
                onClick={() => setContact(true)}
                className="bg-mainColor text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact Owner
              </button>
              <div className="flex flex-wrap  justify-center ">
                {listings.map((listing) => (
                  <div className="p-3 flex flex-wrap ml-2 mr-2 ">
                    <ListingItem key={listing._id} listing={listing} />
                  </div>
                  
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
