import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-xl hover:shadow-lg transition-shadow overflow-hidden rounded-3xl w-full sm:w-[280px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-4 flex flex-col w-full">
          <p className="truncate text-lg font-bold text-secondaryColor">
            {listing.name}
          </p>
          <div className="flex items-center">
            <MdLocationOn className="inline-block mr-2 text-mainColor" />
            <p className="text-secondaryColor text-sm truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-secondaryColor text-lg font-fredoka mt-2">
              Age:{" "}
              {listing.age
                ? `${listing.age.years} y. ${listing.age.months} m.`
                : "Age not available"}
            </p>
            {listing.gender === "male" ? (
              <p className="bg-blue-400 text-white text-center p-1 rounded-md ">
                Male
              </p>
            ) : (
              <p className="bg-pink-400  text-white text-center p-1 rounded-md">
                Female
              </p>
            )}
          </div>
          <p className="text-secondaryColor text-lg font-fredoka mt-2">
            Breed: {listing.breed}
          </p>
          <div className="flex justify-end">
            <p className="text-secondaryColor text-sm font-fredoka ">
              Created at {listing.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
