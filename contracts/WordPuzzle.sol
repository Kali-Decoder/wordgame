// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WordPlay {
    struct User {
        address user;
        uint256 id;
        uint256 amount;
        uint256 claimAmount;
        uint256 multiplier;
        bool claimed;
    }

    User[] public userbets;
    mapping(uint256 => User) public userIdBets;
    uint256 public userID;
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function deposit(uint256 amount) external payable {
        require(amount == msg.value, "REQUIRE AMOUNT");
        User memory _user = User({
            user: msg.sender,
            id: userID,
            amount: amount,
            claimAmount: 0,
            multiplier: 0,
            claimed: false
        });
        userbets.push(_user);
        userIdBets[userID] = _user;
        unchecked {
            userID++;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "YOU ARE NOT OWNER");
        _;
    }

    function resolve(uint256 _id, uint256 _multiplier) external onlyOwner {
        require(_id < userID);
        User storage _user = userIdBets[_id];
        _user.multiplier = _multiplier;
        _user.claimAmount = _user.amount * _user.multiplier;
    }

    function claimReward(uint256 _id) external payable {
        User storage _user = userIdBets[_id];
        require(_user.user == msg.sender, "YOU ARE NOT THE RIGHT PERSON");
        require(_user.claimAmount > 0, "NOTHING TO CLAIM");
        require(!_user.claimed, "ALREADY CLAIMED");

        uint256 reward = _user.claimAmount;
        require(
            address(this).balance >= reward,
            "INSUFFICIENT CONTRACT BALANCE"
        );

        _user.claimed = true;
        (bool sent, ) = msg.sender.call{value: reward}("");
        require(sent, "TRANSFER FAILED");
    }

    function getClaimedRewards()
        external
        view
        onlyOwner
        returns (User[] memory)
    {
        return userbets;
    }

    receive() external payable {}

    function transferFunds() external onlyOwner payable {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "TRANSFER FAILED");
    }
}