// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/MerkleDistributor.sol";
import "../src/MockToken.sol";

contract MerkleDistributorTest is Test {
    MerkleDistributor merkle;
    MockToken token;

    address internal tokenAddress;
    address internal merkleAddress;

    function setUp() public {
        token = new MockToken("Fake USD", "FUSD", 6);
        tokenAddress = address(token);
        merkle = new MerkleDistributor(
            tokenAddress,
            0x65b315f4565a40f738cbaaef7dbab4ddefa14620407507d0f2d5cdbd1d8063f6
        );
        merkleAddress = address(merkle);
    }

    function testClaim() public {
        assertEq(
            merkle.merkleRoot(),
            0x65b315f4565a40f738cbaaef7dbab4ddefa14620407507d0f2d5cdbd1d8063f6
        );
        // check airdrop for address "0x7D13f07889F04a593a3E12f5d3f8Bf850d07465B"
        assertFalse(merkle.isClaimed(44));
        // transfer some money to distributor
        token.mint(merkleAddress, 10);
        bytes32[] memory proofs = new bytes32[](7);
        proofs[
            0
        ] = 0x2669113d3d9b416aaa0821fdebcbfdaf0d8cf24c453614c92b735dc38bd89676;
        proofs[
            1
        ] = 0x230311884f6f50ce4f287d0f0676d3c856287d446144af13ef23692f99d05ddc;
        proofs[
            2
        ] = 0xf5a2d2c6ce389e54d27f0529cf961740fa94b1cda046bb36b852552532bff9d4;
        proofs[
            3
        ] = 0x28566e9884fa5c022f7fddf77f39d5c676a7705172882622300a3b5d4eb46b3b;
        proofs[
            4
        ] = 0x25c03f53a5dae050b95b2dd732f91cfc8a3166dfab75d38a20b283d231c5c0d6;
        proofs[
            5
        ] = 0x023527b3cb4eb23b75f8554373ef468c6cc5a446a5bbf5b26133d684a82dc8ee;
        proofs[
            6
        ] = 0xa8390642d0b4fcbcfd25bd2787f9e498ce1f24c3d630f57a1560354a5b4dd06e;

        merkle.claim(
            44,
            0x7D13f07889F04a593a3E12f5d3f8Bf850d07465B,
            0x0a,
            proofs
        );
    }
}
