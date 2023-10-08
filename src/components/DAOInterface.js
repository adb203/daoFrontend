import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyContractABI from '../abis/MyContract.json';
import Navbar from './Navbar';
import ProposalForm from './ProposalForm';
import ProposalsList from './ProposalsList';
import axios from 'axios';
import { Button, Paper, Typography, Grid } from '@mui/material';
import TypingText from './TypingText';

const CONTRACT_ADDRESS = "0xb7AcA1E969052e7DEea62252fF3a4D594dB4926a";

function DAOInterface() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState({ id: null, balance: null });
    const [proposals, setProposals] = useState([]);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        initWeb3();
    }, []);

    useEffect(() => {
        if (account.id && web3) {
            const intervalId = setInterval(async () => {
                const balanceWei = await web3.eth.getBalance(account.id);
                const updatedBalance = web3.utils.fromWei(balanceWei, 'ether');
                setAccount(prevAccount => ({ ...prevAccount, balance: updatedBalance }));
            }, 10000);
    
            return () => clearInterval(intervalId);
        }
    }, [account.id, web3]);

    useEffect(() => {
        if (account) {
            fetchProposals();
        }
    }, [account]);

    useEffect(() => {
        if (web3) {
            const handleAccountsChanged = async (accounts) => {
                setAccount(accounts[0]);
                debugger
                const memberStatus = await contract.methods.isMember(accounts[0]).call();
                setIsMember(memberStatus);
            };
    
            window.ethereum.on('accountsChanged', handleAccountsChanged);
    
            // Return a cleanup function to remove the event listener
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, [web3, contract]);

    const initWeb3 = async () => {
        try {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const contractInstance = new web3Instance.eth.Contract(MyContractABI.abi, CONTRACT_ADDRESS);
                setContract(contractInstance);

                const accounts = await web3Instance.eth.getAccounts();
                debugger;
                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts found');
                }

                const currentAccountId = accounts[0];
                const balanceWei = await web3Instance.eth.getBalance(currentAccountId);
                const currentAccountBalance = web3Instance.utils.fromWei(balanceWei, 'ether');
                setAccount({ id: currentAccountId, balance: currentAccountBalance });

                // Check if the current user is a member
                const memberStatus = await contractInstance.methods.isMember(currentAccountId).call();
                setIsMember(memberStatus);
            } else {
                throw new Error('Ethereum not detected');
            }
        } catch (error) {
            console.error('Error initializing web3:', error);
        }
    };

    const fetchProposals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/proposals');
            setProposals(response.data);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        }
    };

    const handleJoinDAO = async () => {
        try {
            debugger
            await contract.methods.joinDAO().send({ from: account.id });
    
            // Re-check the membership status after attempting to join
            //const memberStatus = await contract.methods.isMember(account.id).call();
            //setIsMember(memberStatus);
            setIsMember(true)
        } catch (error) {
            console.error("Error joining DAO:", error);
        }
    };

    const handleCreateProposal = async (proposal) => {
        try {
            debugger;
            await contract.methods.createProposal(proposal.description, proposal.createdBy).send({ from: account.id, gas: 5000000 });
            const response = await axios.post('http://localhost:5000/api/proposals', proposal);
            setProposals(prevProposals => [...prevProposals, response.data]);
        } catch (error) {
            console.error("Error creating proposal:", error);
        }
    };

    return (
        <div>
            <Navbar account={account} />
            <Grid container spacing={4} >
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        {isMember ? (
                            <>
                                <ProposalForm onSubmit={handleCreateProposal} account={account} />
                                <ProposalsList 
                                    proposals={proposals} 
                                    fetchProposals={fetchProposals} 
                                    account={account}
                                    web3={web3}
                                    contract={contract}
                                />
                            </>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: '100vh', 
                                flexDirection: 'column'  
                            }}>
                                <div style={{ fontSize: '64px' }}>
                                    <TypingText text="Welcome to the DAO" />
                                </div>
                                <Paper style={{ 
                                    padding: '40px', 
                                    width: '400px', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    marginTop: '100px'
                                }}>
                                    <Typography variant="h4" style={{ marginBottom: '30px' }}>
                                        Enter below
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="large" 
                                        onClick={handleJoinDAO}
                                        style={{ 
                                            borderRadius: 3, 
                                            border: 0, 
                                            color: 'white', 
                                            height: 48, 
                                            padding: '0 30px', 
                                        }}
                                    >
                                        Join DAO
                                    </Button>
                                </Paper>
                            </div>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
    
}

export default DAOInterface;
