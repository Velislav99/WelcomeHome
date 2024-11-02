import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Header from "./components/Header";
import Search from "./pages/Search";

function App() {
  const location = useLocation();
  const [headerName, setHeaderName] = useState("WelcomeHome");

  useEffect(() => {
    
    switch (location.pathname) {
      case "/profile":
        setHeaderName("Profile");
        break;
      case "/help":
        setHeaderName("Help");
        break;
      case "/create-listing":
        setHeaderName("Create Listing");
        break;
      case "/update-listing":
        setHeaderName("Update Listing");
        break;
      case "/signin":
        setHeaderName("SignIn");
        break;
      case "/signup":
        setHeaderName("SignUp");
        break;
      default:
        setHeaderName("WelcomeHome");
    }
  }, [location.pathname]);

  return (
    <>
      <Header headerName={headerName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/help" element={<Help />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
