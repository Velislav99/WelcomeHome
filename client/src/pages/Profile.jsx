import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercantage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  const handleFileUpload = () => {
    if (!file) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      handleShowListings();
      setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
   
  return (
    <>
      <Header headerName="Profile" />
      <div className="p3 max-w-lg mx-auto">
        <h1 className="text-3xl font-fredoka text-mainColor m-2 text-center">
          WelcomeHome
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col ">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser?.avatar}
            alt="Avatar"
            className="w-40 h-40 rounded-full mx-auto object-cover cursor-pointer"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-500">
                Something went wrong *Image must be under 2MB or a valid image
                file*
              </span>
            ) : filePercantage > 0 && filePercantage < 100 ? (
              <span className="text-yellow-500">
                Uploading {filePercantage}%
              </span>
            ) : filePercantage === 100 ? (
              <span className="text-green-500">Uploaded</span>
            ) : (
              ""
            )}
          </p>
          <h2 className="text-secondaryColor text-2xl">Username:</h2>
          <input
            type="text"
            defaultValue={currentUser?.username}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="username"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">Email:</h2>
          <input
            type="email"
            defaultValue={currentUser?.email}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="email"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">City:</h2>
          <input
            type="text"
            defaultValue={currentUser?.city}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="city"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">About me:</h2>
          <input
            type="text"
            defaultValue={currentUser?.aboutme}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="aboutme"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">Password</h2>
          <input
            type="password"
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="password"
            onChange={handleChange}
          />
          <div className="flex">
            <button
              disabled={loading}
              className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto m-3"
            >
              {loading ? "Loading..." : "Update"}
            </button>
            <Link to="/create-listing">
              <button className="flex justify-center items-center p-3 rounded-lg bg-white border-2 border-mainColor m-3 mr-10 w-48 mx-auto text-mainColor">
                Create Listing
              </button>
            </Link>
          </div>
        </form>
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOutUser}
            className="text-red-700 cursor-pointer"
          >
            Sign Out
          </span>
        </div>
        <p className="text-red-500 mt-5">{error ? error : ""}</p>
        <p className="text-green-500 mt-5">
          {updateSuccess ? "User Updated" : ""}
        </p>
        <button 
        onClick={handleShowListings}
        className="bg-mainColor w-full text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80  mx-auto m-3">Show Listings
        </button>
        <p className="text-red-500">{showListingsError ? "Could not fetch listings" : ""}</p>

        {userListings && userListings.length > 0  && 
        <div>
        <h2 className="text-secondaryColor text-2xl text-center my-7 font-bold">Your Listings</h2>
        {userListings.map((listing) => (
          <div key={listing._id} className="gap-4 border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4 flex justify-between items-center">
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="Listing"
                className="w-16 h-16 object-contain rounded-lg" //w-full h-60 object-cover rounded-lg
              />
            </Link>
            <Link className="flex-1 text-secondaryColor text-2xl hover:underline truncate" to={`/listing/${listing._id}`}>
              <h2 >{listing.name}</h2>
            </Link>
            <div className="flex flex-col">
              <button onClick={()=>handleListingDelete(listing._id)} className=" text-red-500 p-1 rounded-lg uppercase hover:opacity-95">DELETE</button>
              <button className=" text-green-500 p-1 rounded-lg uppercase hover:opacity-95">Edit</button>
            </div>
          </div>
        ))}
        </div>}
      </div>
    </>
  );
}
