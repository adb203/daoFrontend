import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, TextField, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function VoteInterface({ selectedProposal, onVote, ethAmount, setEthAmount, onClose }) {
    const [inputError, setInputError] = useState('');
    const [chartData, setChartData] = useState([
        { name: 'Yes', value: selectedProposal.voteCountYes },
        { name: 'No', value: selectedProposal.voteCountNo }
    ]);
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/votes/${selectedProposal._id}`);
                setVotes(response.data);
            } catch (error) {
                console.error("Error fetching votes:", error);
            }
        };
        fetchVotes();
    }, [selectedProposal]);

    useEffect(() => {
        setChartData([
            { name: 'Yes', value: selectedProposal.voteCountYes },
            { name: 'No', value: selectedProposal.voteCountNo }
        ]);
    }, [selectedProposal]);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setInputError(''); 
            setEthAmount(value);
            return;
        }

        if (value <= 0) {
            setInputError('Amount must be greater than 0');
        } else {
            setInputError('');
            setEthAmount(value);
        }
    };
    const COLORS = ['#4CAF50', '#FF5733'];

    return (
        <Paper style={{ padding: '16px', marginTop: '24px' }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                    Selected Proposal: {selectedProposal.description}
                </Typography>
                <Button variant="outlined" color="secondary" onClick={onClose}>Close</Button>
            </Box>

            {(selectedProposal.voteCountYes > 0 || selectedProposal.voteCountNo > 0) && 
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            }

            {selectedProposal.active &&
                <>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="ETH Amount"
                        type="number"
                        value={ethAmount}
                        onChange={handleAmountChange}
                        helperText={inputError || "Enter the amount of ETH you want to stake for your vote."}
                        error={!!inputError}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" onClick={() => onVote(true)} disabled={!!inputError || ethAmount === ''}>
                            Vote Yes
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => onVote(false)} disabled={!!inputError || ethAmount === ''}>
                            Vote No
                        </Button>
                    </Box>
                </>
            }
            <Box mt={4}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Voter</TableCell>
                                <TableCell align="right">Choice</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {votes.map((vote, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {`${vote.voter.substring(0, 6)}...${vote.voter.substring(vote.voter.length - 4)}`}
                                    </TableCell>
                                    <TableCell align="right">{vote.voteChoice ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="right">{vote.ethAmount} ETH</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>
    );
}

export default VoteInterface;
