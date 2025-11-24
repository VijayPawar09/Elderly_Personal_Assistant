import React from "react";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";
import Services from "./Services/service";
import ProjectDetails from "./Footer/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Main />
      <Services />
      <ProjectDetails />
    </div>
  );
};

export default Home;
