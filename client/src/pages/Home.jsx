import React from "react";
import Header from "../components/Header";

export default function Home() {
  const headerName = "WelcomeHome";
  return (
    <>
      <Header headerName={headerName}/>
      <div>Home</div>
    </>
  );
}
