import React, { useState, useEffect } from "react";

const SlideshowApp = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(30000); // Default to 30 seconds
  const [intervalId, setIntervalId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(intervalTime / 1000);
  const [isPaused, setIsPaused] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map((file) => URL.createObjectURL(file)));
    setCurrentIndex(0); // Reset index on new file upload
  };

  const startSlideshow = () => {
    if (images.length === 0) return;
    setIsPaused(false);
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeRemaining(intervalTime / 1000);
    }, intervalTime);
    setIntervalId(id);
  };

  const stopSlideshow = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setIsPaused(false);
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

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    let countdown;
    if (intervalId && !isPaused) {
      countdown = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : intervalTime / 1000));
      }, 1000);
    }
    return () => {
      clearInterval(countdown);
      clearInterval(intervalId);
    };
  }, [intervalId, intervalTime, isPaused]);

  return (
    <div style={styles.container}>
      <div style={styles.timer}>
        {intervalId && !isPaused && <span>{timeRemaining}s</span>}
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
          style={intervalId && !isPaused ? styles.buttonActive : styles.button}
        >
          Start
        </button>
        <button
          onClick={stopSlideshow}
          style={!intervalId && !isPaused ? styles.buttonActive : styles.button}
        >
          Stop
        </button>
        <button onClick={goBack} style={styles.button}>
          Previous
        </button>
        <button onClick={goNext} style={styles.button}>
          Next
        </button>
        <button onClick={enterFullScreen} style={styles.button}>
          Fullscreen
        </button>
        <button onClick={exitFullScreen} style={styles.button}>
          Exit Fullscreen
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
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    backgroundColor: "#f7f7f7",
    minHeight: "100vh",
  },
  fileInput: {
    marginBottom: "20px",
  },
  timer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "16px",
    zIndex: 10,
  },
  imageContainer: {
    width: "80%",
    height: "800px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    marginBottom: "10px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transition: "opacity 0.5s ease-in-out",
  },
  controls: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    margin: "5px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  buttonActive: {
    margin: "5px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#45a049",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transform: "scale(1.05)",
  },
  intervalButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
};

export default SlideshowApp;
