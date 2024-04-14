// Register.js
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  const [file, setFile] = useState(null);
  const [imageNumber, setImageNumber] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [canProceed, setCanProceed] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(0);
  const [username, setUsername] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageCount", uploadedImages + 1);
    formData.append("email", email);

    try {
      const response = await axios.post(
        "http://localhost:4002/register/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.imageCount === 1) {
        setSubmissionStatus(`Image ${imageNumber} submitted successfully`);
        setCanProceed(true);
        setImageNumber(imageNumber + 1);
        setFile(null);

        // Check if it's the second image
        if (uploadedImages === 1) {
          setRegistrationStatus("Registered");
          // Optional: You can reset the image count here if you want to allow more uploads.
          // setUploadedImages(0);
        } else {
          setUploadedImages(uploadedImages + 1);
        }
      } else if (response.data.imageCount === 2) {
        setRegistrationStatus("Registered");
        navigate("/");
      }
    } catch (error) {
      setSubmissionStatus(`Image ${imageNumber} unable to submit`);
      setCanProceed(false);
      setRegistrationStatus(null);
    }
  };

  const handleRetry = () => {
    setSubmissionStatus(null);
    setCanProceed(true);
    setRegistrationStatus(null);
  };

  return (
    <div>
      <p>{registrationStatus}</p>
      {registrationStatus !== "Registered" && (
        <div>
          <p>{submissionStatus}</p>
          {canProceed && (
            <div>
              {/* <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleNameChange}
              /> */}
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleSubmit}>Submit Image {imageNumber}</button>
            </div>
          )}
          {!canProceed && (
            <div>
              <button onClick={handleRetry}>Retry Image {imageNumber}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Register;
