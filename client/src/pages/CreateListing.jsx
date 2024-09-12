import React, { useState } from "react";
import Header from "../components/Header";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

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

  console.log(files);
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
                  className="flex justify-between p-3 border items-center"
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
          <button className="p-3 bg-mainColor text-white rounded uppercase hover:shadow-lg">
            Create Listing
          </button>
        </form>
      </main>
    </>
  );
}
