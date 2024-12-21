import React, { useEffect, useState } from "react";
import { ethers } from "ethers";



const PropertyList = ({ contract, signer }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForSale, setFilterForSale] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [transactionStatus, setTransactionStatus] = useState({
    loading: false,
    error: null,
    success: null,
    propertyId: null
  });

  const filteredProperties = properties
    .filter(property => 
      (property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       property.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterForSale || property.forSale)
    )
    .sort((a, b) => {
      if (sortBy === "price") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  useEffect(() => {
    fetchProperties();
  }, [contract, signer]);

  const fetchProperties = async () => {
    if (!contract || !signer) {
      setError("Wallet not connected");
      setLoading(false);
      return;
    }

    try {
      const propertyCount = await contract.propertyCount();
      const allProperties = [];
      
      for (let i = 1; i <= propertyCount; i++) {
        const property = await contract.properties(i);
        allProperties.push({
          id: i,
          name: property.name,
          location: property.location,
          price: ethers.formatEther(property.price),
          imageHash: property.imageHash,
          owner: property.owner,
          forSale: property.forSale
        });
      }
      setProperties(allProperties);
      setError(null);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to fetch properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyProperty = async (propertyId, price) => {
    if (!contract || !signer) {
      setError("Wallet not connected");
      return;
    }

    setTransactionStatus({
      loading: true,
      error: null,
      success: null,
      propertyId
    });

    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    };

    try {
      // Convert price from ETH to Wei
      const priceInWei = ethers.parseEther(price.toString());
      
      // Call the buyProperty function from the smart contract
      const transaction = await contract.buyProperty(propertyId, {
        value: priceInWei,
        gasLimit: 300000 // You might want to adjust this value
      });

      // Wait for the transaction to be mined
      await transaction.wait();

      setTransactionStatus({
        loading: false,
        error: null,
        success: "Property purchased successfully!",
        propertyId
      });

      // Refresh the properties list
      await fetchProperties();

    } catch (error) {
      console.error("Error buying property:", error);
      setTransactionStatus({
        loading: false,
        error: error.message || "Failed to buy property. Please try again.",
        success: null,
        propertyId
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl text-center max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Available Properties
        </h1>
        <p className="text-xl text-gray-600">
          Discover and invest in premium real estate
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-black"
          >
            <option className="text-black" value="name">Sort by Name</option>
            <option className="text-black" value="price">Sort by Price</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterForSale}
              onChange={(e) => setFilterForSale(e.target.checked)}
              className="rounded text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-gray-700">For Sale Only</span>
          </label>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {property.imageHash && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${property.imageHash}`}
                  alt={property.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Property+Image";
                  }}
                />
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {property.name}
              </h3>

              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {property.location}
                </p>

                <p className="text-gray-600">
                  <span className="font-medium">Price:</span>{" "}
                  <span className="text-indigo-600 font-semibold">
                    {property.price} ETH
                  </span>
                </p>

                <p className="text-gray-600 truncate">
                  <span className="font-medium">Owner:</span>{" "}
                  {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.forSale
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.forSale ? "For Sale" : "Not for Sale"}
                  </span>

                  {property.forSale && 
                   property.owner.toLowerCase() !== signer?.address.toLowerCase() && (
                    <button
                      onClick={() => handleBuyProperty(property.id, property.price)}
                      disabled={transactionStatus.loading && 
                               transactionStatus.propertyId === property.id}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                        transactionStatus.loading && 
                        transactionStatus.propertyId === property.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {transactionStatus.loading && 
                       transactionStatus.propertyId === property.id
                        ? "Processing..."
                        : "Buy Now"}
                    </button>
                  )}
                </div>

                {/* Transaction Status */}
                {transactionStatus.propertyId === property.id && (
                  <div className={`mt-2 p-2 rounded-lg text-sm ${
                    transactionStatus.error 
                      ? "bg-red-100 text-red-700"
                      : transactionStatus.success
                      ? "bg-green-100 text-green-700"
                      : ""
                  }`}>
                    {transactionStatus.error || transactionStatus.success}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No properties found matching your criteria.
          </p>
        </div>
      )}
    </div>
  </div>
);
};


export default PropertyList;
