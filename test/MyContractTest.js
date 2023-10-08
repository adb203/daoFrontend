const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    let instance;

    beforeEach(async () => {
        instance = await MyContract.new();
    });

    describe("Join DAO", () => {

        it("should allow a user to join the DAO", async () => {
            await instance.joinDAO({from: accounts[0]});
            const isMember = await instance.isMember(accounts[0]);
            assert.equal(isMember, true, "Account not added as member");
        });

    });

    describe("Create Proposal", () => {

        beforeEach(async () => {
            // Allow account[0] to create a proposal
            await instance.joinDAO({from: accounts[0]});
        });

        it("should allow a member to create a proposal", async () => {
            const description = "Test proposal";
            await instance.createProposal(description, accounts[0], {from: accounts[0]});
            const proposal = await instance.proposals(0);  // Assuming proposals is a public array
            assert.equal(proposal.description, description, "Proposal not stored correctly");
        });

        //this would require an account at index 1 to be a non member. theres probably better ways of doing this but it is what it is right now
        it("should not allow a non-member to create a proposal", async () => {
            const description = "Test proposal";
            try {
                await instance.createProposal(description, accounts[1], {from: accounts[1]});
                assert.fail("Should not have allowed non-member to create proposal");
            } catch (error) {
                assert(error.message.includes("Not a DAO member"), "Unexpected error message");
            }
        });

    });
    
    describe("Voting on Proposals", () => {

        let proposalId;
        const description = "Test proposal";
    
        beforeEach(async () => {
            // Allow account[0] to create a proposal and get its ID
            await instance.joinDAO({from: accounts[0]});
            await instance.createProposal(description, accounts[0], {from: accounts[0]});
            proposalId = 0;  // Assuming this is the first and only proposal created so far
        });
    
        it("should allow a member to vote on a proposal", async () => {
            await instance.vote(proposalId, true, {from: accounts[0], value: web3.utils.toWei("1", "ether")});
            const proposal = await instance.proposals(proposalId);
            assert.equal(proposal.voteCountYes, 1, "Vote not counted correctly");
        });
    
        it("should not allow a member to vote on an invalid proposal", async () => {
            try {
                await instance.vote(proposalId + 1, true, {from: accounts[0], value: web3.utils.toWei("1", "ether")});
                assert.fail("Should not have allowed voting on an invalid proposal");
            } catch (error) {
                assert(error.message.includes("Invalid proposal"), "Unexpected error message");
            }
        });
    
        it("should require a member to stake a positive amount of ETH when voting", async () => {
            try {
                await instance.vote(proposalId, true, {from: accounts[0], value: 0});
                assert.fail("Should not have allowed voting without staking ETH");
            } catch (error) {
                assert(error.message.includes("Must stake a positive amount of ETH"), "Unexpected error message");
            }
        });
    
    });

});
