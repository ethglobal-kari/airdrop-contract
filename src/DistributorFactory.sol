//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "./MerkleDistributor.sol";

contract DistributorFactory {
    using Address for address;
    // event
    event DistributorSetup(address indexed distributor, string incentiveId);

    constructor() {}

    function createDistributor(
        address _tokenAddress,
        bytes32 _merketRoot,
        uint256 _total,
        string calldata _incentiveId
    ) external returns (address distributorAddress) {
        MerkleDistributor distributor = new MerkleDistributor(
            _tokenAddress,
            _merketRoot,
            _total
        );
        distributorAddress = address(distributor);
        emit DistributorSetup(distributorAddress, _incentiveId);
    }
}
