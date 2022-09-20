// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DistributorFactory.sol";
import "../src/IMerkleDistributor.sol";

contract DistributorFactoryTest is Test {
    // event
    event DistributorSetup(address indexed distributor, string incentiveId);

    DistributorFactory factory;

    address internal factoryAddress;

    function setUp() public {
        factory = new DistributorFactory();
        factoryAddress = address(factory);
    }

    function testCreateDistributor() public {
        address tokenAddress = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
        bytes32 merkleRoot = 0x65b315f4565a40f738cbaaef7dbab4ddefa14620407507d0f2d5cdbd1d8063f6;
        string memory incentiveId = "test-incentive";
        address distributorAddress = factory.createDistributor(
            tokenAddress,
            merkleRoot,
            100,
            incentiveId
        );
        IMerkleDistributor distributor = IMerkleDistributor(distributorAddress);
        assertEq(distributor.token(), tokenAddress);
        assertEq(distributor.merkleRoot(), merkleRoot);
        assertEq(distributor.total(), 100);
    }
}
