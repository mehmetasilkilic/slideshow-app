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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
        <button onClick={toggleFullscreen} style={styles.button}>
          Toggle Fullscreen
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
    background: "linear-gradient(135deg, #f9f9f9, #e0e0e0)",
    minHeight: "100vh",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  fileInput: {
    margin: "10px",
    cursor: "pointer",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "8px",
    border: "2px solid #ccc",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  timer: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    textShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
  imageContainer: {
    width: "80%",
    height: "800px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.5)",
    position: "relative",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "20px",
    transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
    transform: "scale(1.05)",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    margin: "10px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundImage: "linear-gradient(135deg, #4CAF50, #45a049)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    transition: "background-image 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    outline: "none",
    textShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
  },
  buttonActive: {
    margin: "10px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundImage: "linear-gradient(135deg, #43A047, #388E3C)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    transition: "background-image 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    transform: "scale(1.1)",
    outline: "none",
    textShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
  },
  intervalButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default SlideshowApp;
