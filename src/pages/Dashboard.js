import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
import loadingImage from "../images/preloader.gif";
import { GithubContext, GithubProvider } from "../context/context";
const Dashboard = () => {
  const data = React.useContext(GithubContext);
  const { loading } = React.useContext(GithubContext);
  if (loading) {
    return (
      <main>
        <Navbar></Navbar>
        <Search />
        <img className="loading-img" src={loadingImage} alt="loading" />
      </main>
    );
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search />
      <Info />
      <User />
      <Repos />
    </main>
  );
};

export default Dashboard;
