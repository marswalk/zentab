import React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Background from "./components/Background"; // Import the Background component
import WebPlayback from "./WebPlayback";
import { Buffer } from "buffer";
import queryString from "query-string";

export default class AuthCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }

  async componentDidMount() {
    const spotify_client_id = "3a3ec62d2eff4bff95306f264a4cf571";
    const spotify_client_secret = "b43a15aecfeb4f8b9a1b961c3865eca0";

    console.log("MOUNTED");

    var params = new URLSearchParams(window.location.search);
    console.log("PARAMS", params);

    var code = params.get("code");
    console.log("CODE", code);

    var authOptions = {
      method: "POST",
      body: queryString.stringify({
        code: code,
        redirect_uri: "https://hxy4xq-5173.csb.app/auth/callback",
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
            "base64",
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    console.log(authOptions);

    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        localStorage.setItem("access_token", responseJson["access_token"]);
        window.location.href = "https://hxy4xq-5173.csb.app/";
      });
  }

  render() {
    return <div>AUTH CALLBACK</div>;
  }
}
