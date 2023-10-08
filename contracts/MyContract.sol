// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract MyContract {
    
    struct Proposal {
        string description;
        uint voteCountYes;
        uint voteCountNo;
        bool active;
        address creator;
    }

    mapping(address => bool) public isMember;
    Proposal[] public proposals;
    
    // Keeps track of how much ETH a user has staked on a proposal.
    mapping(address => mapping(uint => uint256)) public userStakes;
    
    mapping(address => mapping(uint => bool)) public hasVoted;

    event NewProposal(address indexed creator, string description);
    event Voted(address indexed voter, uint proposalId, bool vote, uint256 stakedAmount);

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a DAO member");
        _;
    }

    function joinDAO() external {
        isMember[msg.sender] = true;
    }

    function createProposal(string calldata _description, address _createdBy) external onlyMember {
        proposals.push(Proposal({
            description: _description,
            voteCountYes: 0,
            voteCountNo: 0,
            active: true,
            creator: _createdBy
        }));

        emit NewProposal(msg.sender, _description);
    }

    function vote(uint _proposalId, bool _voteYes) external payable onlyMember {
        require(_proposalId < proposals.length, "Invalid proposal");
        require(proposals[_proposalId].active, "Proposal not active");
        require(msg.value > 0, "Must stake a positive amount of ETH");
        
        if (_voteYes) {
            proposals[_proposalId].voteCountYes++;
        } else {
            proposals[_proposalId].voteCountNo++;
        }

        userStakes[msg.sender][_proposalId] = msg.value;
        hasVoted[msg.sender][_proposalId] = true;

        emit Voted(msg.sender, _proposalId, _voteYes, msg.value);
    }

    function closeProposal(uint _proposalId) external onlyMember {
        require(_proposalId < proposals.length, "Invalid proposal");
        proposals[_proposalId].active = false;
    }
}
