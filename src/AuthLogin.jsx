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
    const spotify_client_id = "58f4e7693bea44cdbc62061fb3e78ba3";
    const SPOTIFY_CLIENT_SECRET = "d7b15b709feb4c3784182b607bb54b31";

    console.log("MOUNTED");
    var scope = "streaming user-read-email user-read-private";
    var state = this.generateRandomString(16);
    console.log("STATE", state);

    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: "https://hxy4xq-5173.csb.app/auth/callback",
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
