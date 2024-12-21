import React from 'react';

const About = () => {
  return (
    <div className=" p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">About RealEstate DApp</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Welcome to <span className="font-semibold text-blue-600"> <span className='bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent text-2xl'>BlockEstate</span> RealEstate DApp</span>, a decentralized platform designed to revolutionize property transactions using blockchain technology. Our application ensures transparency, security, and efficiency in buying and selling real estate properties.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to simplify real estate transactions by eliminating intermediaries, reducing fraud, and ensuring secure ownership records. With blockchain and decentralized storage, we aim to create a trusted ecosystem for buyers and sellers.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-purple-600 mb-2">Key Features</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Decentralized property listing and ownership verification</li>
              <li>IPFS-based image storage for property details</li>
              <li>Smart contracts for secure and transparent transactions</li>
              <li>User-friendly interface with authentication</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Why Choose Us?</h2>
          <p className="text-gray-600">
            RealEstate DApp is built with cutting-edge blockchain technology, ensuring data immutability and security. Whether you're a buyer or a seller, our platform empowers you to make informed decisions with confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
