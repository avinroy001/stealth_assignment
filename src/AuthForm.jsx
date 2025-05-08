import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import { LockOpen, PersonAdd } from '@mui/icons-material';
import TaskManager from './TaskManager/TaskManager';

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isRegister) {
                if (!email || !password || !confirmPassword) {
                    throw new Error('All fields are required.');
                }
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }

                const response = await axios.post('http://localhost:3001/auth/register', {
                    email,
                    password,
                });

                console.log('Registration successful:', response.data);
                alert('Registration successful. Please login.');
                setIsRegister(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                if (!email || !password) {
                    throw new Error('Email and password are required.');
                }

                const response = await axios.post('http://localhost:3001/auth/login', {
                    email,
                    password,
                });

                const { token } = response.data;
                localStorage.setItem('authToken', token);
                alert('Login successful!');
                console.log('Token stored:', token);

                setIsAuthenticated(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    if (isAuthenticated) {
        return <TaskManager />;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Card sx={{ width: 400, p: 3, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom color="primary">
                        {isRegister ? 'Register' : 'Login'}
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {isRegister && (
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}

                    {error && (
                        <Typography color="error" align="center" mt={1}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleAuth}
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                    </Button>

                    <Box mt={2} display="flex" justifyContent="center">
                        <Button
                            size="small"
                            onClick={() => setIsRegister(!isRegister)}
                            startIcon={isRegister ? <LockOpen /> : <PersonAdd />}
                        >
                            {isRegister ? 'Switch to Login' : 'Switch to Register'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AuthForm;
