import { ethers } from "ethers";
import RealEstateABI from '/RealEstateABI.json' // Copy ABI from artifacts

const CONTRACT_ADDRESS = "0x87043a5a759D2A47DA5270e59E62679aab1F13D8";

export const getContract = (signer) => {
    return new ethers.Contract(CONTRACT_ADDRESS, RealEstateABI, signer);
  };
  
  // Fetch properties from the contract
  export const fetchProperties = async (contract) => {
    const propertyCounts = await contract.propertyCount;
    const properties = [];
    for (let i = 0; i < propertyCounts; i++) {
      const property = await contract.properties(i);
      properties.push({
        name: property.name,
        location: property.location,
        price: property.price.toString(),
        owner: property.owner,
      });
    }
}
