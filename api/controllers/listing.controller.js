import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing has been deleted");
  }catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id)

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let vaccinations = req.query.vaccinations;
    if (vaccinations === undefined || vaccinations === "false") {
      vaccinations = { $in: [false, true] };
    }

    let gender = req.query.gender;
    if (gender === undefined || gender === "all") {
      gender = { $in: ["male", "female"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    // Build a match query for filtering by search term, vaccinations, and gender
    const matchQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { breed: { $regex: searchTerm, $options: "i" } }
      ],
      vaccinations,
      gender,
    };

    let listings;

    if (sort === "random") {
      // Use aggregation with $sample for random ordering
      listings = await Listing.aggregate([
        { $match: matchQuery },
        { $sample: { size: limit } }
      ]);
    } else {
      // Regular sorting based on specified field and order
      listings = await Listing.find(matchQuery)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(startIndex);
    }

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

