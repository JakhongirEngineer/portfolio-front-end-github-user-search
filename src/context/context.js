import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = React.useState(mockUser);
  const [repos, setRepos] = React.useState(mockRepos);
  const [followers, setFollowers] = React.useState(mockFollowers);

  const [requests, setRequests] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({ show: false, msg: "" });

  const errorMessages = {
    nouser: "such user does not exist",
    limitation: "you exceeded the limitation",
  };

  const searchGithubUser = async (user) => {
    handelError();
    setLoading(true);
    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((e) => console.log(e));

    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      Promise.allSettled([
        axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios.get(`${rootUrl}/users/${login}/followers?per_page=100`),
      ])
        .then((results) => {
          const [repositoriesResponse, followersResponse] = results;
          const fulfilled = "fulfilled";

          if (repositoriesResponse.status === fulfilled) {
            setRepos(repositoriesResponse.value.data);
          }
          if (followersResponse.status === fulfilled) {
            setFollowers(followersResponse.value.data);
          }
          setLoading(false);
        })
        .catch((e) => console.log(e));
    } else {
      if (!error.msg === errorMessages.limitation) {
        handelError(true, errorMessages.nouser);
      }
      setLoading(false);
    }
  };

  function handleRequests() {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then((response) => {
        const remaining = response.data.rate.remaining;
        console.log(remaining);
        // remaining = 0;
        setRequests(remaining);
        if (remaining === 0) {
          // error is thrown
          handelError(true, errorMessages.limitation);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handelError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(handleRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        loading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
