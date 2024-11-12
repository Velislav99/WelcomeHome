import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

export default function Home() {
  const [listings, setListings] = useState([]);

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listing/get?limit=10");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching recent listingss:", error);
      }
    };
    fetchListings();
  }, []);
  return (
    <div className="mx-auto max-w-[1400px]">
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

      {listings && listings.length > 0 && (
        <div className="max-w-7xl mx-auto p-3 my-7 gap-4">
        <Swiper
          navigation
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={false}
          breakpoints={{
            320: { slidesPerView: 1 },      
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1132: { slidesPerView: 4 },
          }}
        >
          {listings.map((listing) => (
            <SwiperSlide
              key={listing._id}
              className="flex justify-center"
            >
              <div className="bg-white shadow-lg rounded-lg   max-w-sm">
                <ListingItem listing={listing} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      )}
    </div>
  );
}
