import React, { useState, useEffect } from "react";

const Background = ({ setBackground }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/limhenry/earthview/master/earthview.json",
    )
      .then((response) => response.json())
      .then((data) => {
        setBackgrounds(data);
        const randomIndex = Math.floor(Math.random() * data.length);
        setSelectedBackground(data[randomIndex]);
        setBackground(data[randomIndex]?.image);
      })
      .catch((error) => {
        console.error("Error fetching backgrounds:", error);
      });
  }, []);

  const handleRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setSelectedBackground(backgrounds[randomIndex]);
    setBackground(backgrounds[randomIndex]?.image);
  };

  return (
    <div className="background-info">
      {selectedBackground && (
        <div>
          <p>
            Country:{" "}
            <a
              href={selectedBackground.map}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedBackground.country}
            </a>
          </p>
          {selectedBackground.region && (
            <p>
              Region:{" "}
              <a
                href={selectedBackground.map}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedBackground.region}
              </a>
            </p>
          )}
        </div>
      )}
      <button onClick={handleRandomBackground}>Change Background</button>
    </div>
  );
};

export default Background;
