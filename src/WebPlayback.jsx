import React, { useState, useEffect } from "react";
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";
import {
  Box,
  Image,
  Text,
  Flex,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback(props) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    console.log("WebPlayback TESTER");
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          console.log("INSIDE TOKEN", props.token);
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <>
        <div className="container">
          <Flex
            flexDirection="row"
            className="main-wrapper"
            alignItems="center"
          >
            <FaSpotify fontSize="lg" />
            <Text fontSize="lg" marginLeft="15px">
              {" "}
              Instance not active.
              <br />
              Transfer your playback using your Spotify app{" "}
            </Text>
          </Flex>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <Flex className="main-wrapper">
            <Image
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
              boxSize="70px"
              borderRadius="15px"
            />

            <Flex minWidth="max-content" alignItems="center" gap="2">
              <Box marginLeft="20px" marginRight="20px">
                <Text fontSize="lg" as="b">
                  {current_track.name}
                </Text>
                <Text fontSize="md" color="gray.200">
                  {current_track.artists[0].name}
                </Text>
              </Box>

              <ButtonGroup spacing="10px">
                <IconButton
                  aria-label="Previous"
                  icon={<IoPlaySkipBack />}
                  onClick={() => {
                    player.previousTrack();
                  }}
                  isRound={true}
                  bg="none"
                  size="100%"
                  color="white"
                  fontSize="25px"
                />
                <IconButton
                  aria-label={is_paused ? "Play" : "Pause"}
                  icon={is_paused ? <IoPlayCircle /> : <IoPauseCircle />}
                  onClick={() => {
                    player.togglePlay();
                  }}
                  isRound={true}
                  bg="none"
                  size="100%"
                  color="white"
                  fontSize="50px"
                />
                <IconButton
                  aria-label="Next"
                  icon={<IoPlaySkipForward />}
                  onClick={() => {
                    player.nextTrack();
                  }}
                  isRound={true}
                  bg="none"
                  size="100%"
                  color="white"
                  fontSize="25px"
                />
              </ButtonGroup>
            </Flex>
          </Flex>
        </div>
      </>
    );
  }
}

export default WebPlayback;
