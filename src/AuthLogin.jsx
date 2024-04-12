import React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Background from "./components/Background"; // Import the Background component
import WebPlayback from "./WebPlayback";

export default class AuthLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }

  componentDidMount() {
    console.log();
    const spotify_client_id = "3a3ec62d2eff4bff95306f264a4cf571";
    const spotify_client_secret = "b43a15aecfeb4f8b9a1b961c3865eca0";

    console.log("MOUNTED");
    var scope =
      "streaming user-read-email user-read-private user-read-currently-playing user-modify-playback-state user-read-playback-state";
    var state = this.generateRandomString(16);
    console.log("STATE", state);

    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: window.location.origin + "/auth/callback",
      state: state,
    });

    console.log(auth_query_parameters);
    const url =
      "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString();
    console.log(url);
    window.location.href = url;
  }

  generateRandomString = function (length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  render() {
    return <div>AUTH LOGIN</div>;
  }
}
