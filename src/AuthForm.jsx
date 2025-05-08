import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import { LockOpen, PersonAdd } from '@mui/icons-material';

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (type: 'login' | 'register') => {
        setLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            if (type === 'register') {
                if (!username || !email || !password || !confirmPassword) {
                    throw new Error('All fields are required for registration.');
                }
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                console.log('Registering:', { username, email, password });
            } else {
                if (!email || !password) {
                    throw new Error('Email and password are required for login.');
                }
                console.log('Logging in:', { email, password });
            }

            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

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
                        {isRegister ? 'Create Account' : 'Login'}
                    </Typography>

                    {isRegister && (
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}

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
                        onClick={() => handleAuth(isRegister ? 'register' : 'login')}
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
