import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import logo from "../assets/logo.png";

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
        console.error("Error fetching recent listings:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="md:flex mt-20 mb-20 justify-between">
        <div className="flex flex-col place-items-center justify-center text-center text-white p-4 md:ml-20">
          <h1 className="text-4xl font-fredoka text-mainColor ">
            Adopt, Don’t Shop – Give a Shelter Pet a Home!
          </h1>
          <p className="text-secondaryColor justify-between text-2xl font-fredoka">
            Join us in giving a second chance to loving animals in need. Instead
            of buying, choose adoption and provide a forever home to a pet
            waiting for a family. Every adoption helps save lives and creates
            lasting bonds. Visit our site today to find your perfect companion!
          </p>

          <Link
            to="/search"
            className="mt-4 bg-mainColor text-white py-2 px-4 rounded-lg"
          >
            Find your pet
          </Link>
        </div>
        <img
          src="../../Home.png"
          alt="Home cover image"
          className="h-[600px] hidden lg:block"
        />
      </div>

      {/* Recent Listings */}
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
              <SwiperSlide key={listing._id} className="flex justify-center">
                <div className="bg-white shadow-lg rounded-lg max-w-sm">
                  <ListingItem listing={listing} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Information Section */}
      <div className="max-w-7xl mx-auto p-3 justify-center text-center">
        <h1 className="text-4xl font-fredoka text-mainColor">
          Your journey to pet adoption starts here
        </h1>
        <p className="text-secondaryColor font-fredoka max-w-3xl mx-auto">
          We offer comprehensive services to help you find your perfect pet. Our
          dedicated team is here to assist you every step of the way.
        </p>
      </div>
      <div className="flex md:flex-row flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center p-4 w-1/2">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-center text-mainColor font-fredoka text-2xl">
            Adoption Assistance
          </h1>
          <p className="font-fredoka text-secondaryColor">
            Find your furry friend with our personalized adoption support and
            guidance.
          </p>
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-center text-mainColor font-fredoka text-2xl">
            Get involved
          </h1>
          <p className="font-fredoka text-secondaryColor">
            Join our community of volunteers and make a difference in the lives
            of pets.
          </p>
        </div>
        <img src={logo} alt="" className="h-[200px] md:h-[400px]" />
        <div className="flex flex-col justify-center items-center text-center p-4 w-1/2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-center text-mainColor font-fredoka text-2xl">
            Support our mission
          </h1>
          <p className="font-fredoka text-secondaryColor">
            Your donations help us provide care and shelter for pets in need.
          </p>
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-center text-mainColor font-fredoka text-2xl">
            Learn more
          </h1>
          <p className="font-fredoka text-secondaryColor">
            Discover how you can help and make a positive impact today.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-mainColor border-t border-mainColor py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center flex-wrap">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-fredoka">AdoptMe</h3>
              <p className="text-sm">© 2024 AdoptMe. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/about" className="text-sm hover:underline">
                About Us
              </Link>
              <Link to="/contact" className="text-sm hover:underline">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
