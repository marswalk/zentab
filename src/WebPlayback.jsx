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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import "./App.css";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

let current_track = track.album;
let is_active = false;
let is_paused = false;
let slider_control = false;
let start_time = 0;
let duration_time = 1;
let progress_val = 0;

function WebPlayback(props) {
  const SendUrl = async (url, method) => {
    var authOptions = {
      method: method,
      headers: {
        Authorization: "Bearer " + props.token,
      },
    };
    console.log(authOptions);
    let output = null;
    const response = await fetch(url, authOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        output = responseJson;
        //current_track = responseJson["item"];

        //is_active = true;
      });

    return output;
  };

  useEffect(() => {
    startup();

    setInterval(() => update(), 2000);
    setInterval(() => slider_update(), 500);
  }, []);

  const startup = async () => {
    console.log("HITTER");

    const info = await SendUrl("https://api.spotify.com/v1/me/player", "GET");
    console.log(info);
    current_track = info["item"];
    is_active = true;
  };

  const update = async () => {
    const info = await SendUrl("https://api.spotify.com/v1/me/player", "GET");
    console.log(info);
    current_track = info["item"];
    is_paused = !info["is_playing"];
    is_active = true;

    const time = Date.now();
    start_time = time - info["progress_ms"];
    duration_time = current_track["duration_ms"];
  };

  const slider_update = async () => {
    if (slider_control === true) {
      return;
    }
    const time = Date.now();
    const diff = time - start_time;
    progress_val = Math.round((diff / duration_time) * 1000);
    console.log("PROGRESS", progress_val);
  };

  const buttonPress = async (type) => {
    if (type === "play") {
      is_paused = !is_paused;
      const url = !is_paused
        ? "https://api.spotify.com/v1/me/player/play"
        : "https://api.spotify.com/v1/me/player/pause";
      console.log(url);

      await SendUrl(url, "PUT");
    } else if (type === "right") {
      await SendUrl("https://api.spotify.com/v1/me/player/next", "POST");
    } else if (type === "left") {
      await SendUrl("https://api.spotify.com/v1/me/player/previous", "POST");
    }
  };

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
          <Flex className="main-wrapper" direction="column" alignItems="left" gap="4">
            <Flex direction="row" alignItems="center" gap="2">
            <FaSpotify size="20px" />
            <Text fontSize="sm" as="b">
            Now playing
            </Text>
            </Flex>
            <Flex gap="5">
              <Image
                src={current_track.album.images[0].url}
                className="now-playing__cover"
                alt=""
                boxSize="75px"
                borderRadius="15px"
              />
              <Flex direction="column" alignItems="center" gap="1">
                <Flex minWidth="max-content" alignItems="center" gap="5">
                  <Box>
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
                        buttonPress("left");
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
                        buttonPress("play");
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
                        buttonPress("right");
                      }}
                      isRound={true}
                      bg="none"
                      size="100%"
                      color="white"
                      fontSize="25px"
                    />
                  </ButtonGroup>
                </Flex>
                <Slider
                  id="SLIDER-ID"
                  aria-label="seek"
                  min={0}
                  max={1000}
                  value={slider_control ? undefined : progress_val}
                  onChangeStart={(value) => {
                    slider_control = true;
                    console.log("CONTROL");
                  }}
                  onChangeEnd={async (value) => {
                    slider_control = false;
                    await SendUrl(
                      `https://api.spotify.com/v1/me/player/seek?position_ms=${Math.round((value / 1000) * duration_time)}`,
                      "PUT",
                    );
                    console.log("CONTROL GONE");
                    start_time =
                      Date.now() - Math.round((value / 1000) * duration_time);

                    setTimeout(() => {
                      update();
                    }, 1000);
                  }}
                  colorScheme="green"
                  focusThumbOnChange={false}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb className="spotifyslider" />
                </Slider>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </>
    );
  }
}

export default WebPlayback;
