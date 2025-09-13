// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract RealEstate {
    uint public propertyCount = 0;

    struct Property {
        uint id;
        string name;
        string location;
        uint price; // in wei
        string imageHash; // IPFS hash
        address payable owner;
        bool forSale;
    }

    mapping(uint => Property) public properties;

    event PropertyAdded(uint id, string name, address indexed owner);
    event OwnershipTransferred(uint id, address indexed newOwner);

    function addProperty(string memory _name, string memory _location, uint _price, string memory _imageHash) public {
        require(_price > 0, "Price must be greater than zero");
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, _name, _location, _price, _imageHash, payable(msg.sender), true);
        emit PropertyAdded(propertyCount, _name, msg.sender);
    }

    function buyProperty(uint _id) public payable {
        Property memory _property = properties[_id];
        require(_property.forSale, "Property not for sale");
        require(msg.value >= _property.price, "Insufficient funds");

        _property.owner.transfer(msg.value);
        properties[_id].owner = payable(msg.sender);
        properties[_id].forSale = false;

        emit OwnershipTransferred(_id, msg.sender);
    }

    function toggleForSale(uint _id, bool _forSale) public {
        require(msg.sender == properties[_id].owner, "Only owner can update status");
        properties[_id].forSale = _forSale;
    }
}
 
// deployed : 0x87043a5a759D2A47DA5270e59E62679aab1F13D8