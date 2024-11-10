import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listing/get?limit=3");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching recent listingss:", error);
      }
    };
    fetchListings();
  }, []);
  return (
    <div>
      <div className="md:flex mt-20 mb-20 md:mt-0 md:mb-0">
       
        <img
          src="../../Home.png"
          alt="Home cover image"
          className="h-[400px] hidden md:block"
        />

        
        <div className="flex flex-col place-items-center justify-center text-center text-white p-4 ">
          <h1 className="text-3xl font-bold text-secondaryColor ">
            Find your perfect <br /> furry
            <span className="text-mainColor"> companion</span> now!
          </h1>

          <Link
            to="/search"
            className="mt-4 bg-mainColor text-white py-2 px-4 rounded-lg"
          >
            Find your pet
          </Link>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col">
        <div className="min-w-[400px]">
          <h2 className="text-3xl font-bold text-secondaryColor text-center mt-8">
            Every pet deserves a loving home. Join us in making a difference -
            adopt a friend for life!
          </h2>
          <div className="flex justify-center items-center text-justify mt-4 m-4">
            Welcome to a place where every pet deserves a loving home! Our pet
            adoption website is dedicated to connecting compassionate
            individuals with animals looking for a second chance. Whether you’re
            searching for a playful pup, a cuddly kitten, or a gentle senior
            companion, you’ll find a variety of wonderful pets of all shapes,
            sizes, and personalities. Each pet listed here has their own story
            and is waiting to start a new chapter with a family like yours. By
            choosing to adopt, you’re not only bringing joy into your life but
            also making a life-changing difference for an animal in need. Join
            us in the mission to give every pet a loving home—because every
            adoption is a new beginning.
          </div>
        </div>
        <img
          src="../../Home1.png"
          alt="Pet Adoption"
          className=" rounded-3xl mr-4 hidden lg:block lg:h-[400px]"
        />
      </div>
      <h2 className="text-3xl font-fredoka text-secondaryColor text-center mt-8">
        Recent Pets
      </h2>
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
