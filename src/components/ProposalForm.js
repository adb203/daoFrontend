import React, { useState } from 'react';
import { Button, TextField, Paper, Typography } from '@mui/material';

function ProfileForm({ onSubmit, account }) {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const proposalData = {
            description,
            createdBy: account.id, 
        };
    
        try {
            await onSubmit(proposalData); 
            setDescription('');
        } catch (error) {
            console.error("Error creating proposal:", error);
        }
    };
    
    

    return (
        <Paper style={{ padding: '16px', marginBottom: '24px' }}>
            <Typography variant="h6">Create a New Proposal</Typography>
            <form onSubmit={handleSubmit}>
                <TextField 
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Proposal Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={!description}
                >
                    Create Proposal
                </Button>
            </form>
        </Paper>
    );
}

export default ProfileForm;
