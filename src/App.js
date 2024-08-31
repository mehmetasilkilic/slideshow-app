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
    setCurrentIndex(0); // Reset index on new file upload
    setTimeRemaining(intervalTime / 1000); // Reset timer on new file upload
  };

  const startSlideshow = () => {
    if (images.length === 0) return;
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    // Set new interval
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeRemaining(intervalTime / 1000);
    }, intervalTime);
    setIntervalId(id);
  };

  const stopSlideshow = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setTimeRemaining(intervalTime / 1000); // Reset the timer display when stopping
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetTimer(); // Reset the timer when going to the next slide
  };

  const goBack = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    resetTimer(); // Reset the timer when going back
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

  const resetTimer = () => {
    stopSlideshow();
    startSlideshow();
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
        <button onClick={resetTimer} style={styles.button}>
          Reset Timer
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
    background: "linear-gradient(135deg, #1F1C2C, #928DAB)",
    minHeight: "100vh",
    boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  fileInput: {
    margin: "10px",
    cursor: "pointer",
    fontSize: "18px",
    padding: "12px",
    borderRadius: "12px",
    border: "3px solid #FFFFFF",
    backgroundColor: "#222",
    color: "#fff",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  timer: {
    position: "absolute",
    top: "20px",
    right: "30px",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    color: "#00FFC6",
    padding: "15px 30px",
    borderRadius: "30px",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "0px 0px 15px rgba(0, 255, 198, 0.8)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.6)",
    zIndex: 10,
    animation: "pulse 2s infinite",
  },
  imageContainer: {
    width: "90%",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.8)",
    position: "relative",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    margin: "15px",
    padding: "20px 40px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundImage: "linear-gradient(135deg, #ff4081, #ff79b0)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    transition: "background-image 0.4s ease, transform 0.3s ease",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
    outline: "none",
    textShadow: "0px 2px 5px rgba(0, 0, 0, 0.4)",
    animation: "hoverEffect 3s infinite alternate",
  },
  buttonActive: {
    margin: "15px",
    padding: "20px 40px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundImage: "linear-gradient(135deg, #ff6f61, #ff8e72)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    transition: "background-image 0.4s ease, transform 0.3s ease",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
    transform: "scale(1.1)",
    outline: "none",
    textShadow: "0px 2px 5px rgba(0, 0, 0, 0.4)",
    animation: "hoverEffect 3s infinite alternate",
  },
  intervalButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default SlideshowApp;
