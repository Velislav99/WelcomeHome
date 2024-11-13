import React, { useEffect, useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const {currentUser} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    age: { years: "", months: "" }, // Update here
    breed: "",
    type: "",
    gender: "male",
    vaccinations: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
      const fetchListing = async () => {
          const listingId = params.listingId;
          const res = await fetch(`/api/listing/get/${listingId}`);
          const data = await res.json();
          setFormData(data);
      }
      fetchListing()
  },[])
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrls: formData.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError("image upload failed (2MB max per iamge)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You ca only upload a maximum of 6 images");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    if (id === "years" || id === "months") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        age: { ...prevFormData.age, [id]: value },
      }));
    } else if (id === "male" || id === "female") {
      setFormData({ ...formData, gender: id });
    } else if (id === "vaccinations") {
      setFormData({ ...formData, vaccinations: e.target.checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef:currentUser._id}),
        
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-fredoka text-mainColor text-center my-7">
          Update Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 ">
            <input
              type="text"
              placeholder="Name"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="name"
              maxLength="62"
              minLength="3"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="description"
              maxLength="5000"
              minLength="50"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
              id="address"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <input
                type="text"
                placeholder="Type"
                className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1 "
                id="type"
                required
                onChange={handleChange}
                value={formData.type}
              />

            <div className="flex flex-wrap sm:flex-row gap-3 ">
            <div className="flex flex-wrap sm:flex-row gap-3">
                  <input
                    type="number"
                    placeholder="Years"
                    className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1"
                    id="years"
                    required
                    onChange={handleChange}
                    value={formData.age.years}
                  />
                  <input
                    type="number"
                    placeholder="Months"
                    className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1"
                    id="months"
                    required
                    onChange={handleChange}
                    value={formData.age.months}
                  />
                </div>
              <input
                type="text"
                placeholder="Breed"
                className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg flex-1 "
                id="breed"
                required
                onChange={handleChange}
                value={formData.breed}
              />
            </div>
            <div className="flex flex-wrap sm:flex-row gap-3">
              <div>
                <span className="mr-2 text-secondaryColor">Gender:</span>
                <input
                  type="checkbox"
                  className="w-5"
                  id="male"
                  onChange={handleChange}
                  checked={formData.gender === "male"}
                />
                <span className="ml-2 text-secondaryColor">Male</span>
              </div>{" "}
              <div>
                <input
                  type="checkbox"
                  className="w-5"
                  id="female"
                  onChange={handleChange}
                  checked={formData.gender === "female"}
                />
                <span className="ml-2 text-secondaryColor">Female</span>
              </div>
            </div>
            <div>
              <input
                type="checkbox"
                className="w-5"
                id="vaccinations"
                onChange={handleChange}
                checked={formData.vaccinations}
              />
              <span className="ml-2 text-secondaryColor">Vaccinations</span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2 ">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-3">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3 bg-mainColor text-white rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-500">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center mt-3"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button disabled = {loading || uploading} className="p-3 bg-mainColor text-white rounded uppercase hover:shadow-lg">
            {loading? "Loading..." : "Update Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </main>
    </>
  );
}
