import React, { useState, useEffect } from "react";

const SlideshowApp = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(30000); // Default to 30 seconds
  const [intervalId, setIntervalId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(intervalTime / 1000);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map((file) => URL.createObjectURL(file)));
  };

  const startSlideshow = () => {
    if (images.length === 0) return;
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeRemaining(intervalTime / 1000);
    }, intervalTime);
    setIntervalId(id);
  };

  const stopSlideshow = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeRemaining(intervalTime / 1000);
  };

  const goBack = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setTimeRemaining(intervalTime / 1000);
  };

  const handleIntervalChange = (time) => {
    setIntervalTime(time);
    setTimeRemaining(time / 1000);
    if (intervalId) {
      stopSlideshow();
      startSlideshow();
    }
  };

  useEffect(() => {
    let countdown;
    if (intervalId) {
      countdown = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : intervalTime / 1000));
      }, 1000);
    }
    return () => {
      clearInterval(countdown);
      clearInterval(intervalId);
    };
  }, [intervalId, intervalTime]);

  return (
    <div style={styles.container}>
      <div style={styles.timer}>
        {intervalId && <span>{timeRemaining}s</span>}
      </div>
      <div style={styles.intervalButtons}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {[30000, 45000, 60000, 120000, 300000, 600000].map((time) => (
          <button
            key={time}
            onClick={() => handleIntervalChange(time)}
            style={intervalTime === time ? styles.buttonActive : styles.button}
          >
            {time / 1000}s
          </button>
        ))}
      </div>
      <div style={styles.imageContainer}>
        {images.length > 0 && (
          <img
            src={images[currentIndex]}
            alt="Slideshow"
            style={styles.image}
          />
        )}
      </div>
      <div style={styles.controls}>
        <button
          onClick={startSlideshow}
          style={intervalId ? styles.buttonActive : styles.button}
        >
          Start
        </button>
        <button
          onClick={stopSlideshow}
          style={!intervalId ? styles.buttonActive : styles.button}
        >
          Stop
        </button>
        <button onClick={goBack} style={styles.button}>
          Previous
        </button>
        <button onClick={goNext} style={styles.button}>
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  fileInput: {},
  timer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "16px",
  },
  imageContainer: {
    width: "80%",
    height: "800px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  controls: {
    marginBottom: "20px",
  },
  button: {
    margin: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  buttonActive: {
    margin: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  intervalButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default SlideshowApp;
