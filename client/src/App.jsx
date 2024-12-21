import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { connectWallet } from './utils/connectWallet'; // Adjust path as needed
import { getContract } from './utils/contract'; // Adjust path as needed

// Import components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PropertyList from "./components/PropertyList";
import AddProperty from "./components/AddProperty";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./About";

// ProtectedRoute Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Initialize Web3 connection
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const { signer } = await connectWallet();
        const contractInstance = getContract(signer);

        setSigner(signer);
        setContract(contractInstance);
        setWalletConnected(true);

        console.log("Web3 initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Web3:", error);
      }
    };

    if (isAuthenticated) {
      initializeWeb3();
    }
  }, [isAuthenticated]);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setSigner(null);
    setContract(null);
    setWalletConnected(false);
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        walletConnected={walletConnected}
      />
      <div className="w-full h-screen">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to="/" /> :
                <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ?
                <Navigate to="/" /> :
                <Signup />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home contract={contract} signer={signer} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PropertyList
                  contract={contract}
                  signer={signer}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {contract && signer ? (
                  <AddProperty contract={contract} signer={signer} />
                ) : (
                  <div className="text-center p-4">
                    Please connect your wallet to add a property
                  </div>
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <About />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
      
    </Router>
   
  );
};

export default App;



