import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import PlayerForm from "./PlayerForm";

const EditPlayerModal = ({ showModal, onClose, player}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    sport: "cricket",
    battingStyle: "",
    bowlingStyle: "",
    country: "",
    image: null,
    imgLink: "",
    fantasyPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { BACKEND_URL, fetchAllPlayers } = useContext(AppContext);

  // Set form data when player changes
  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName || "",
        lastName: player.lastName || "",
        position: player.position || "",
        sport: player.sport || "cricket",
        battingStyle: player.battingStyle || "",
        bowlingStyle: player.bowlingStyle || "",
        country: player.country || "",
        image: null,
        imgLink: player.imgLink || "",
        fantasyPrice: player.fantasyPrice ? player.fantasyPrice.toString() : "",
      });
    }
  }, [player]);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      position: "",
      sport: "cricket",
      battingStyle: "",
      bowlingStyle: "",
      country: "",
      image: null,
      imgLink: "",
      fantasyPrice: "",
    });
  };

  const handleUpdatePlayer = async () => {
    if (!formData.firstName.trim() || !formData.position || !formData.country.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!player?._id) {
      toast.error("Player ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      let imgLink = formData.imgLink;
      
      // Upload new image if provided
      if (formData.image) {
        const form = new FormData();
        form.append("player", formData.image);
        const res = await axios.post(`${BACKEND_URL}/api/upload/player`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials:true
        });
        
        // Store only WebP URL
        imgLink = res.data.image_url;
      }

      // Update player
      const { data } = await axios.put(
        `${BACKEND_URL}/api/players/${player._id}`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          sport: formData.sport,
          position: formData.position,
          battingStyle: formData.battingStyle,
          bowlingStyle: formData.bowlingStyle,
          country: formData.country.trim(),
          imgLink: imgLink,
          fantasyPrice: formData.fantasyPrice ? parseFloat(formData.fantasyPrice) : undefined,
        },
        {
          withCredentials: true
        }
      );

      if (data.success) {
        toast.success("Player updated successfully");
        resetForm();
        onClose();
        // Refresh the players list to show the updated player
        await fetchAllPlayers();
      }
    } catch (err) {
      console.error('Error updating player:', err);
      toast.error(err.response?.data?.message || "Failed to update player");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageDeleted = () => {
    // Update the form data to reflect that image has been deleted
    setFormData(prev => ({ ...prev, imgLink: "", image: null }));
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Player</h2>
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
          onSubmit={handleUpdatePlayer}
          onCancel={handleClose}
          mode="edit"
          existingImageUrl={player?.imgLink || ""}
          backendUrl={BACKEND_URL}
          isSubmitting={isSubmitting}
          playerId={player?._id}
          onImageDeleted={handleImageDeleted}
        />
      </div>
    </div>
  );
};

export default EditPlayerModal;