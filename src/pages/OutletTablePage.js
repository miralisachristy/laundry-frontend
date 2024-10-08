import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "../styles/csspages.css"; // Import the global CSS file

const OutletTablePage = () => {
  const [editingOutlet, setEditingOutlet] = useState(null); // State for the outlet being edited
  const [outlets, setOutlets] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // Object to track files for each outlet
  const [formData, setFormData] = useState({
    outlet_name: "",
    address: "",
    phone: "",
    describ: "",
  }); // State for storing form data

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch outlet data
    const fetchOutlets = () => {
      axios
        .get("http://localhost:3000/api/outlets")
        .then((response) => {
          setOutlets(response.data.data); // Ensure this is an array of outlet objects
        })
        .catch((error) => {
          console.error("Error fetching outlet data:", error);
        });
    };

    fetchOutlets(); // Fetch data initially
  }, []);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to open the edit form
  const handleEditOutlet = (outlet) => {
    setEditingOutlet(outlet.id_outlet); // Set the outlet being edited
    setFormData({
      outlet_name: outlet.outlet_name,
      address: outlet.address,
      phone: outlet.phone,
      describ: outlet.describ, // Field for description
    });
  };

  // Function to save changes and call the update API
  const handleSaveChanges = (outletId) => {
    axios
      .put(`http://localhost:3000/api/outlets/update/${outletId}`, formData)
      .then((response) => {
        // Update UI after successful save
        setOutlets((prevOutlets) =>
          prevOutlets.map((outlet) =>
            outlet.id_outlet === outletId
              ? { ...outlet, ...formData } // Update outlet data in the UI
              : outlet
          )
        );
        setEditingOutlet(null); // Close the edit form after saving
        alert("Outlet updated successfully!");
        localStorage.clear();
        navigate("/"); // Navigate to the Forgot Password page
        window.location.reload(); // This will reload the entire page
      })
      .catch((error) => {
        console.error("Error updating outlet:", error);
        alert("Error updating the outlet.");
      });
  };

  const handleFileChange = (event, outletId) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [outletId]: event.target.files[0],
    }));
  };

  const handleLogoUpload = (outletId) => {
    const selectedFile = selectedFiles[outletId]; // Get the file for the specific outlet
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);
    axios
      .put(
        `http://localhost:3000/api/outlets/update-logo/${outletId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // Clear the selected file for this outlet
        setSelectedFiles((prevSelectedFiles) => ({
          ...prevSelectedFiles,
          [outletId]: null,
        }));
        // Re-fetch the latest outlet data after successful upload
        window.location.reload(); // This will reload the entire page
      })
      .catch((error) => {
        console.error("Error uploading the logo:", error);
        alert("Error uploading the logo.");
      });
  };

  return (
    <div className="container">
      <Navigation /> {/* Add Navigation here */}
      <div className="content">
        <h2 style={{ textAlign: "left", marginRight: "20px" }}>Outlet</h2>
        <div className="outlet-list">
          {outlets.length > 0 ? (
            outlets.map((outlet) => (
              <div className="outlet-card" key={outlet.id_outlet}>
                <div className="outlet-box">
                  <h3 style={{ marginLeft: "20px" }}>Logo</h3>
                  {outlet.logo ? (
                    <img
                      style={{ marginLeft: "20px" }}
                      src={`http://localhost:3000${outlet.logo}`} // Correct string interpolation
                      alt={`${outlet.outlet_name} logo`} // Correct string interpolation
                      className="outlet-image"
                    />
                  ) : (
                    <p>No Logo</p>
                  )}
                  <p></p>
                  <input
                    style={{ marginLeft: "10px", marginBottom: "10px" }}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleFileChange(event, outlet.id_outlet)
                    } // Pass outlet ID
                  />
                  <button
                    style={{ marginBottom: "10px" }}
                    className="update-button"
                    onClick={() => handleLogoUpload(outlet.id_outlet)} // Pass outlet ID
                  >
                    Update Logo
                  </button>
                </div>
                <div className="outlet-info-box">
                  {/* Form for editing */}
                  {editingOutlet === outlet.id_outlet ? (
                    <div>
                      <h3>Edit Outlet</h3>
                      <label>
                        <h4>
                          Outlet Name:
                          <input
                            type="text"
                            name="outlet_name"
                            maxLength={20}
                            value={formData.outlet_name}
                            onChange={handleInputChange}
                          />
                        </h4>
                      </label>
                      <label>
                        <h4>
                          Address:
                          <input
                            type="text"
                            name="address"
                            maxLength={40}
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </h4>
                      </label>
                      <label>
                        <h4>
                          Phone:
                          <input
                            type="text"
                            name="phone"
                            maxLength={15}
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </h4>
                      </label>
                      <label>
                        <h4>
                          Description:
                          <textarea
                            type="text"
                            name="describ"
                            value={formData.describ}
                            onChange={handleInputChange}
                          />
                        </h4>
                      </label>
                      <button
                        className="save-button"
                        onClick={() => handleSaveChanges(outlet.id_outlet)}
                      >
                        Submit
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setEditingOutlet(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3>Outlet Name :</h3>
                      <p>{outlet.outlet_name}</p>
                      <h3>Address :</h3>
                      <p>{outlet.address}</p>
                      <h3>Phone :</h3>
                      <p>{outlet.phone}</p>
                      <h3>Description :</h3>
                      <p>{outlet.describ}</p>
                      <button
                        className="update-button"
                        onClick={() => handleEditOutlet(outlet)}
                      >
                        Update Outlet
                      </button>
                    </div>
                  )}
                </div>

                <div className="outlet-box no-border">
                  <div className="outlet-box">
                    <h3>Created At</h3>
                    <p>
                      {new Date(outlet.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date(outlet.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="outlet-box">
                    <h3>Updated At</h3>
                    <p>
                      {new Date(outlet.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date(outlet.updated_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No outlets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletTablePage;
