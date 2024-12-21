import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
  });
  const [status, setStatus] = useState("");
  const [signupMethod, setSignupMethod] = useState("email"); // "email" or "metamask"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const connectMetaMask = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      
      // Get the signer to request message signature
      const signer = await provider.getSigner();
      
      // Create a message for the user to sign
      const message = `Welcome to Real Estate DApp!\nPlease sign this message to verify your wallet ownership.\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
      
      // Request signature
      const signature = await signer.signMessage(message);
      
      setFormData(prev => ({ ...prev, walletAddress: address }));
      
      // You can now use the signature to verify the user on your backend
      handleMetaMaskSignup(address, signature);
      
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetaMaskSignup = async (address, signature) => {
    try {
      const response = await axios.post("http://localhost:5000/register/metamask", {
        walletAddress: address,
        signature: signature
      });

      if (response.status === 201) {
        setStatus("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || "MetaMask signup failed.");
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setStatus("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>

        {/* Signup Method Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSignupMethod("email")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              signupMethod === "email"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Email Signup
          </button>
          <button
            onClick={() => setSignupMethod("metamask")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              signupMethod === "metamask"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            MetaMask
          </button>
        </div>

        {signupMethod === "email" ? (
          <form onSubmit={handleEmailSignup} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up with Email"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-white mb-6">
              Connect your MetaMask wallet to create an account
            </p>
            <button
              onClick={connectMetaMask}
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                "Connecting..."
              ) : (
                <>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s"
                    alt="MetaMask"
                    className="w-6 h-6"
                  />
                  Connect MetaMask
                </>
              )}
            </button>
          </div>
        )}

        {status && (
          <div className={`mt-4 p-4 rounded-lg ${
            status.includes("successful") 
              ? "bg-green-500/20 text-green-100"
              : "bg-red-500/20 text-red-100"
          }`}>
            {status}
          </div>
        )}

        <p className="text-sm text-center text-white/80 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-white hover:underline font-medium">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
