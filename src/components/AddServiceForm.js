import React, { useState } from "react";
import axios from "axios";
import "../styles/csspages.css"; // Import the global CSS file

const AddServiceForm = ({ onClose, onAdd }) => {
  const [newService, setNewService] = useState({
    image: "",
    service_name: "",
    service_type: "Kiloan", // Set default value
    processing_time: "",
    price: "",
    unit: "kg", // Set default value
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    // Validasi manual untuk price
    if (newService.price < 0 || newService.price > 999999999) {
      setError("Price must be between 0 and 999999999");
      return;
    }

    const formData = new FormData();
    Object.keys(newService).forEach((key) =>
      formData.append(key, newService[key])
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/services",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onAdd(response.data.data);
      onClose();
      setNewService({
        image: "",
        service_name: "",
        service_type: "Kiloan", // Reset to default value
        processing_time: "",
        price: "",
        unit: "kg", // Reset to default value
      });
    } catch (error) {
      console.error(
        "Failed to add service:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response
          ? error.response.data.message
          : "Failed to add service. Please try again."
      );
    }
  };

  return (
    <div className="add-service-box">
      <h3>Add New Service</h3>
      <form onSubmit={handleAddService}>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="service_name">Service Name:</label>
          <input
            id="service_name"
            type="text"
            name="service_name"
            maxLength={30}
            placeholder="Service Name - Processing Time"
            value={newService.service_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="service_type">Service Type:</label>
          <select
            id="service_type"
            name="service_type"
            value={newService.service_type}
            onChange={handleInputChange}
            required
            style={{ marginLeft: "10px" }} // Margin-left
          >
            <option value="Kiloan">Kiloan</option>
            <option value="Satuan">Satuan</option>
          </select>
        </div>
        <div>
          <label htmlFor="processing_time">Processing Time:</label>
          <input
            id="processing_time"
            type="text"
            placeholder="Example: 24"
            name="processing_time"
            maxLength={3}
            value={newService.processing_time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            min="0" // Batas minimal
            max="999999999" // Batas maksimal
            placeholder="Example: 25000"
            value={newService.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="unit">Unit:</label>
          <select
            id="unit"
            name="unit"
            value={newService.unit}
            onChange={handleInputChange}
            required
            style={{ marginLeft: "10px" }} // Margin-left
          >
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
          </select>
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={(e) =>
              setNewService((prev) => ({ ...prev, image: e.target.files[0] }))
            }
            required
          />
        </div>
        <button type="submit" className="save-button">
          Submit
        </button>
        <button
          className="cancel-button"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddServiceForm;
