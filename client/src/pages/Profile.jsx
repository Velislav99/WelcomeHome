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
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercantage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            placeholder={currentUser?.username}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="username"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">Email:</h2>
          <input
            type="email"
            placeholder={currentUser?.email}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="email"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">City:</h2>
          <input
            type="text"
            placeholder={currentUser?.city}
            className="border border-secondaryColor shadow-sm shadow-gray-500 p-3 rounded-lg mb-4"
            id="city"
            onChange={handleChange}
          />
          <h2 className="text-secondaryColor text-2xl">About me:</h2>
          <input
            type="text"
            placeholder={currentUser?.aboutme}
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
            <button disabled={loading} className="bg-mainColor text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48 mx-auto m-3">
              {loading ? "Loading..." : "Update"}
            </button>
            <button className="flex justify-center items-center p-3 rounded-lg bg-white border-2 border-mainColor m-3 w-48 mx-auto text-mainColor">
              Create Posting
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
        <p className="text-red-500 mt-5">{error? error : "" }</p>
        <p className="text-green-500 mt-5">{updateSuccess? 'User Updated' : "" }</p>
      </div>
    </>
  );
}
