import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "metamask"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const signer = await provider.getSigner();

      // Get nonce from server
      const nonceResponse = await axios.post("http://localhost:5000/auth/metamask/nonce", {
        walletAddress: address,
      });

      // Sign the message
      const message = nonceResponse.data.message;
      const signature = await signer.signMessage(message);

      // Verify signature with backend
      const authResponse = await axios.post("http://localhost:5000/auth/metamask/verify", {
        walletAddress: address,
        signature,
      });

      if (authResponse.data.token) {
        localStorage.setItem("token", authResponse.data.token);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "MetaMask login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Welcome Back</h2>

        {/* Login Method Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              loginMethod === "email"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod("metamask")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              loginMethod === "metamask"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            MetaMask
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 text-red-100 text-center">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-6">
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

            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-white/60 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white/80">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-white hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-white mb-6">
              Connect your MetaMask wallet to sign in
            </p>
            <button
              onClick={handleMetaMaskLogin}
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
                  Connect with MetaMask
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-sm text-center text-white/80 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-white hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;


