//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";

/**
 * @title A contract to demonstrate DAO
 * @author Me
 */
contract DAO {
    /// Enum for voting options
    enum VoteOption {
        NONE,
        FOR,
        AGAINST
    }

    /// Enum for voting results
    enum VotingResult {
        NONE,
        ACCEPTED,
        REJECTED,
        INVALID
    }

    /// Enum for choosing voting type
    enum VotingType {
        NONE,
        STANDART,
        NO_RECIPIENT
    }

    /**
     * @dev This struct holds information about the voting
     * @param description Description about voting
     * @param createdAt Creation time of voting
     * @param duration Duration of voting
     * @param totalSupplyAtCreation Total supply at the time of voting created
     * @param totalFor Total vote count that people accepted the voting
     * @param totalAgainst Total vote count that people rejected the voting
     * @param result Result of the voting
     * @param votingType Voting type of the voting
     * @param recipient Recipient of the call data
     * @param callData Call data to send to recipient
     * @param addressOption Mapping for the addresses option
     */
    struct Voting {
        string description;
        uint256 createdAt;
        uint256 duration;
        uint256 totalSupplyAtCreation;
        uint256 totalFor;
        uint256 totalAgainst;
        VotingResult result;
        VotingType votingType;
        address recipient;
        bytes callData;
        mapping(address => VoteOption) addressOption;
    }

    /**
     * @dev This struct holds information about address balance
     * @param balance Balance of the address
     * @param timestamp The time user deposited funds to this contract
     * @param withdrawTime The time user allowed to withdraw funds
     */
    struct AddressBalance {
        uint256 balance;
        uint256 timestamp;
        uint256 withdrawTime;
    }

    /// Minimum percentage for quorum
    uint256 public constant minimumQuorumPercentage = 50;

    /// Erc contract
    IERC20 public ercContract;
    /// The latest voting id
    uint256 private _votingId;
    /// A mapping for storing id and voting object
    mapping(uint256 => Voting) private _idVoting;
    /// A mapping for storing address and address balance object
    mapping(address => AddressBalance) private _addressBalance;
    /// A mapping for storing delegation between addresses
    mapping(address => address) private _voteDelegation;

    /**
     * @dev Emitted when a voting is created
     * @param votingId Id of created voting
     * @param description Description of created voting
     * @param votingType Type of created voting
     */
    event VotingCreated(
        uint256 indexed votingId,
        string description,
        VotingType votingType
    );

    /**
     * @dev Emitted when a user voted
     * @param votingId Id of voted voting
     * @param voter Address of the voter
     * @param option Option of the voter
     * @param voteAmount The amount that voter voted
     */
    event Vote(
        uint256 indexed votingId,
        address voter,
        VoteOption option,
        uint256 voteAmount
    );

    /**
     * @dev Emitted when a voting is finished
     * @param votingId Id of finished voting
     * @param totalVoted Total vote amount
     * @param result The result of voting
     */
    event VotingFinished(
        uint256 indexed votingId,
        uint256 totalVoted,
        VotingResult result
    );

    /**
     * @dev A modifier for checking validity of the voting
     * @param id Id of voting that is going to be checked
     */
    modifier validVoting(uint256 id) {
        require(_idVoting[id].createdAt > 0, "Voting not found");
        _;
    }

    /**
     * @dev Sets the erc20 contract
     * @param _ercContract The address of erc20
     */
    function setErcContract(address _ercContract) external {
        ercContract = IERC20(_ercContract);
    }

    /**
     * @dev Creates a standart voting
     * @param description The description of the voting
     * @param recipient Recipient of the call data
     * @param callData Call data to send to recipient
     */
    function createVoting(
        string memory description,
        address recipient,
        bytes memory callData
    ) external {
        _createVoting(description, VotingType.STANDART, recipient, callData);
    }

    /**
     * @dev Creates a no recipient voting
     * @param description The description of the voting
     */
    function createVoting(string memory description) external {
        _createVoting(description, VotingType.NO_RECIPIENT, address(0), "");
    }

    /**
     * @dev Delegates voting to given address
     * @param delegateAddress The address that caller delegates to
     */
    function delegateVotesTo(address delegateAddress) external {
        _voteDelegation[msg.sender] = delegateAddress;
    }

    /**
     * @dev Votes
     * @param votingId The id of voting
     * @param option The option of caller
     */
    function vote(uint256 votingId, VoteOption option) external {
        _vote(votingId, msg.sender, option);
    }

    /**
     * @dev Votes for someone else
     * @param votingId The id of voting
     * @param votingAddress The address the caller gonna vote for
     * @param option The option of caller
     */
    function voteFor(
        uint256 votingId,
        address votingAddress,
        VoteOption option
    ) external {
        require(
            _voteDelegation[votingAddress] != address(0),
            "This address did not delegate his votes to any address yet"
        );
        require(
            _voteDelegation[votingAddress] == msg.sender,
            "You cannot vote for this address"
        );
        _vote(votingId, votingAddress, option);
    }

    /**
     * @dev Finishes the voting
     * @param votingId The id of voting to finish
     */
    function finishVoting(uint256 votingId) external validVoting(votingId) {
        Voting storage voting = _idVoting[votingId];
        uint256 votingEndTime = voting.createdAt + voting.duration;
        require(block.timestamp > votingEndTime, "Too early to finish");
        require(voting.result == VotingResult.NONE, "Voting already finished");

        VotingResult result;
        uint256 totalVoted = voting.totalFor + voting.totalAgainst;
        uint256 minimumQuorum = (voting.totalSupplyAtCreation *
            minimumQuorumPercentage) / 100;

        if (totalVoted >= minimumQuorum) {
            if (voting.totalFor > voting.totalAgainst) {
                result = VotingResult.ACCEPTED;
            } else {
                result = VotingResult.REJECTED;
            }
        } else {
            result = VotingResult.INVALID;
        }

        voting.result = result;

        if (result == VotingResult.ACCEPTED) {
            if (voting.votingType == VotingType.STANDART) {
                (bool success, ) = voting.recipient.call(voting.callData);
                require(success, "Voting finished unsuccessfully");
            }
        }

        emit VotingFinished(votingId, totalVoted, result);
    }

    /**
     * @dev Get voting option of the address
     * @param votingId The id of voting to query
     * @param voterAddress The voter address to get option from
     * @return the voting option of the address
     */
    function getAddressVote(uint256 votingId, address voterAddress)
        external
        view
        returns (VoteOption)
    {
        return _idVoting[votingId].addressOption[voterAddress];
    }

    /**
     * @dev Get voting details
     * @param votingId The id of voting to get details about
     */
    function getVotingDetail(uint256 votingId)
        external
        view
        validVoting(votingId)
        returns (
            string memory description,
            uint256 createdAt,
            uint256 duration,
            uint256 totalSupplyAtCreation,
            uint256 totalFor,
            uint256 totalAgainst,
            VotingResult result,
            VotingType votingType,
            address recipient,
            bytes memory callData
        )
    {
        Voting storage voting = _idVoting[votingId];

        return (
            voting.description,
            voting.createdAt,
            voting.duration,
            voting.totalSupplyAtCreation,
            voting.totalFor,
            voting.totalAgainst,
            voting.result,
            voting.votingType,
            voting.recipient,
            voting.callData
        );
    }

    /**
     * @dev Deposits funds to this contract
     * @param amount Amount to deposit
     */
    function deposit(uint256 amount) external {
        AddressBalance storage balance = _addressBalance[msg.sender];
        balance.balance += amount;
        balance.timestamp = block.timestamp;
        // Assuming user approved tokens for this contract
        ercContract.transferFrom(msg.sender, address(this), amount);
    }

    /// @dev Withdraws funds from the contract
    function withdraw() external {
        AddressBalance storage balance = _addressBalance[msg.sender];
        require(balance.balance > 0, "This address balance is empty");
        require(
            block.timestamp > balance.withdrawTime,
            "Too early to withdraw"
        );
        uint256 amount = balance.balance;
        balance.balance = 0;
        balance.timestamp = block.timestamp;
        ercContract.transfer(msg.sender, amount);
    }

    /// @dev See {createVoting}
    function _createVoting(
        string memory description,
        VotingType votingType,
        address recipient,
        bytes memory callData
    ) private {
        uint256 duration = 3 * (60 * 60 * 24); // 3 days in seconds
        Voting storage voting = _idVoting[_votingId++];
        voting.result = VotingResult.NONE;
        voting.votingType = votingType;
        voting.description = description;
        voting.createdAt = block.timestamp;
        voting.duration = duration;
        voting.recipient = recipient;
        voting.callData = callData;
        voting.totalSupplyAtCreation = ercContract.totalSupply();

        emit VotingCreated(_votingId - 1, description, votingType);
    }

    /// @dev See {vote} and see {voteFor}
    function _vote(
        uint256 votingId,
        address votingAddress,
        VoteOption option
    ) private validVoting(votingId) {
        Voting storage voting = _idVoting[votingId];
        AddressBalance storage balance = _addressBalance[votingAddress];
        uint256 votingEndTime = voting.createdAt + voting.duration;
        require(votingEndTime > block.timestamp, "Voting is already ended");
        require(option != VoteOption.NONE, "Invalid vote");
        require(
            voting.addressOption[votingAddress] == VoteOption.NONE,
            "The address already voted"
        );

        uint256 amountToVote = balance.balance;

        require(amountToVote > 1, "Balance is not enough for voting");

        voting.addressOption[votingAddress] = option;

        if (option == VoteOption.FOR) {
            voting.totalFor += amountToVote;
        } else {
            voting.totalAgainst += amountToVote;
        }

        if (votingEndTime > balance.withdrawTime)
            balance.withdrawTime = votingEndTime;

        emit Vote(votingId, votingAddress, option, amountToVote);
    }
}
