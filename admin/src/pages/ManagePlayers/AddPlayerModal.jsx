import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import PlayerForm from "./PlayerForm";

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  position: "",
  sport: "cricket",
  battingStyle: "",
  bowlingStyle: "",
  country: "",
  image: null,
};

const AddPlayerModal = ({ showModal, onClose, onPlayerAdded }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { BACKEND_URL } = useContext(AppContext);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const handleAddPlayer = async () => {
    if (!formData.firstName.trim() || !formData.position || !formData.country.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      
      // Upload image if provided
      if (formData.image) {
        const form = new FormData();
        form.append("player", formData.image);
        const res = await axios.post(`${BACKEND_URL}/upload/player`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.image_url;
      }

      // Create player
      const { data } = await axios.post(`${BACKEND_URL}/api/players`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        sport: formData.sport,
        position: formData.position,
        battingStyle: formData.battingStyle,
        bowlingStyle: formData.bowlingStyle,
        country: formData.country.trim(),
        imgLink: imageUrl,
      });

      if (data.success) {
        toast.success("Player added successfully");
        resetForm();
        onClose();
        onPlayerAdded(data.player);
      }
    } catch (err) {
      console.error('Error adding player:', err);
      toast.error(err.response?.data?.message || "Failed to add player");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Player</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <PlayerForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddPlayer}
          onCancel={handleClose}
          mode="add"
          backendUrl={BACKEND_URL}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddPlayerModal;