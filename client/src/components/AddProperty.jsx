import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers"; // Ensure ethers.js is imported
import { CloudUploadIcon, LocationMarkerIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { motion } from "framer-motion";

const AddProperty = ({ contract, signer }) => { // Pass contract and signer as props
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    image: null,
  });
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState(""); // New state variable

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setSelectedImageName(file.name); // Update selected image name
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadToPinata = async () => {
    if (!formData.image) {
      setErrorMessage("Please upload an image.");
      return null;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", formData.image);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "554667581854110d6d36",
            pinata_secret_api_key: "26a3fdcc51f8f0bb4951f31a5baee82ac8c8a28fb9c03f86d8e4399c94aa52a0",
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      setIpfsHash(ipfsHash);
      return ipfsHash;
    } catch (error) {
      setErrorMessage("Error uploading image to IPFS: " + error.message);
      console.error(error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Upload image to IPFS via Pinata
      const ipfsHash = await uploadToPinata();
      if (!ipfsHash) return; // If no image hash, stop the process

      // Convert price to wei (from ETH)
      const priceInWei = ethers.parseEther(formData.price);

      // Interact with the smart contract to add the property
      const tx = await contract.addProperty(
        formData.name,
        formData.location,
        priceInWei,
        ipfsHash,
        { from: signer.address } // Ensure the transaction is sent from the signer
      );
      await tx.wait(); // Wait for the transaction to be mined

      setSuccessMessage("Property added successfully!");
      setFormData({
        name: "",
        description: "",
        location: "",
        price: "",
        image: null,
      });
      setSelectedImageName(""); // Reset selected image name
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while adding the property.");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            List Your Property
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Add your property to the blockchain and reach global investors
          </motion.p>
        </div>

        {/* Main Form Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Status Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 p-4 rounded-t-2xl"
            >
              <p className="text-red-600">{errorMessage}</p>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 p-4 rounded-t-2xl"
            >
              <p className="text-green-600">{successMessage}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Property Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <label className="block">
                  <span className="text-gray-700 font-semibold">Property Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block text-black p-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Enter property name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold">Location</span>
                  <div className="mt-1 relative">
                    <LocationMarkerIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full text-black p-2 pl-10 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      placeholder="Property location"
                      required
                    />
                  </div>
                </label>
              </motion.div>

              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <label className="block">
                  <span className="text-gray-700 font-semibold">Price (ETH)</span>
                  <div className="mt-1 relative">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full text-black p-2 pl-10 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      placeholder="Property price in ETH"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block text-black p-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    placeholder="Describe your property"
                    required
                  />
                </label>
              </motion.div>
            </div>

            {/* Image Upload Section */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <label className="block">
                <span className="text-gray-700 font-semibold">Property Image</span>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-500 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {selectedImageName && (
                  <p className="mt-2 text-sm text-gray-600 text-center">
                    Selected file: {selectedImageName}
                  </p>
                )}
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg transform transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Property...
                  </div>
                ) : (
                  "List Property"
                )}
              </button>
            </motion.div>
          </form>

          {/* IPFS Status */}
          {ipfsHash && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-50 border-t border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Image Upload Status
              </h3>
              <p className="text-green-600 mb-2">✓ File uploaded successfully!</p>
              <div className="bg-white p-4 rounded-lg text-sm font-mono break-all">
                <p className="text-gray-600">IPFS Hash: {ipfsHash}</p>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-500 mt-2 inline-block"
                >
                  View Image on IPFS →
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddProperty;





