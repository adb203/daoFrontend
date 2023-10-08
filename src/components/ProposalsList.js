import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import VoteInterface from './VoteInterface';

function ProfileList({ proposals, fetchProposals, account, web3, contract }) {
    const [filter, setFilter] = useState("ALL");
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [ethAmount, setEthAmount] = useState(0);

    const handleSelect = (proposal) => {
        setSelectedProposal(proposal)
    }

    useEffect(() => {
        if (selectedProposal){
            const updatedSelectedProposal = proposals.find(p => p._id === selectedProposal._id);
            setSelectedProposal(updatedSelectedProposal || null);
        }
    }, [proposals, selectedProposal]);

    const handleVote = async (proposalId, voteChoice) => {
        try {
            const proposalIndex = proposals.findIndex(p => p._id === proposalId);
            
            const ethAmountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');

            await contract.methods.vote(proposalIndex, voteChoice).send({ from: account.id, value: ethAmountInWei, gas: 5000000 });
            
            const data = {
                voter: account.id,
                proposalId,
                voteChoice,
                ethAmount 
            };
            await axios.post(`http://localhost:5000/api/proposals/${proposalId}/vote`, data);
            fetchProposals();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };  

    const deactivateProposal = async (proposalId) => {
        try {
            const proposalIndex = proposals.findIndex(p => p._id === proposalId);
            await contract.methods.closeProposal(proposalIndex).send({ from: account.id });

            await axios.put(`http://localhost:5000/api/proposals/${proposalId}/deactivate`);
            setSelectedProposal(null);
            fetchProposals();
        } catch (error) {
            console.error("Error deactivating proposal:", error);
        }
    };

    const filteredProposals = proposals.filter(proposal => {
        if (filter === "OPEN") return proposal.active;
        if (filter === "CLOSED") return !proposal.active;
        return true;  // for ALL
    });

    return (
        <Paper style={{ padding: '16px' }}>
            <Typography variant="h6" style={{ marginBottom: '12px' }}>Proposals</Typography>
            <Box display="flex" justifyContent="center" marginBottom={2}>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={(_, value) => setFilter(value)}
                    aria-label="filter"
                >
                    <ToggleButton value="ALL" aria-label="all">
                        ALL
                    </ToggleButton>
                    <ToggleButton value="OPEN" aria-label="open">
                        OPEN
                    </ToggleButton>
                    <ToggleButton value="CLOSED" aria-label="closed">
                        CLOSED
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <List style={{ marginTop: '16px' }}>
                {filteredProposals.map((proposal, index) => (
                    <div key={index}>
                        <ListItem divider>
                            <ListItemText
                                primary={proposal.description}
                                secondary={`Created by: ${proposal.createdBy.substring(0, 6)}...${proposal.createdBy.substring(proposal.createdBy.length - 4)} | Yes Votes: ${proposal.voteCountYes} | No Votes: ${proposal.voteCountNo}`}
                            />
                            <ListItemSecondaryAction>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={{ marginRight: '8px' }} 
                                    onClick={() => handleSelect(proposal)}
                                >
                                    Select
                                </Button>
                                {proposal.active && 
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => deactivateProposal(proposal._id)}
                                    >
                                        Deactivate
                                    </Button>
                                }
                            </ListItemSecondaryAction>
                        </ListItem>
                        {selectedProposal && selectedProposal._id === proposal._id && (
                            <VoteInterface 
                                selectedProposal={selectedProposal} 
                                onVote={(voteChoice) => handleVote(proposal._id, voteChoice)} 
                                ethAmount={ethAmount} 
                                setEthAmount={setEthAmount} 
                                onClose={() => setSelectedProposal(null)}
                            />
                        )}
                    </div>
                ))}
            </List>
        </Paper>
    );
}

export default ProfileList;
