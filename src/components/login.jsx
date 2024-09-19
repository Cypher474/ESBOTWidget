// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = "http://192.168.100.25:8000/";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setLoading(false)
                const { thread_id } = data;
                localStorage.setItem('threadId', thread_id);
                navigate('/');
            } else {
                throw new Error('Invalid login credentials');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'rgba(255, 121, 0, 0.125)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '28rem', // Approximately max-w-md in Tailwind
                    padding: '2rem',
                    backgroundColor: '#ff790010',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2
                    style={{
                        marginBottom: '1rem',
                        fontSize: '1.5rem', // Approximately text-2xl
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#ff7900',
                    }}
                >
                    Login
                </h2>

                {error && (
                    <p
                        style={{
                            marginBottom: '1rem',
                            color: '#f56565', // Red color for error
                        }}
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>
                    <div
                        style={{
                            marginBottom: '1rem',
                        }}
                    >
                        <label
                            htmlFor="email"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem', // Approximately text-sm
                                fontWeight: '500',
                                color: '#ff7900',
                                marginBottom: '0.25rem',
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.5rem 0.75rem', // Approximately px-3 py-2
                                border: '1px solid #ff7900',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginBottom: '1rem',
                        }}
                    >
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem', // Approximately text-sm
                                fontWeight: '500',
                                color: '#ff7900',
                                marginBottom: '0.25rem',
                            }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.5rem 0.75rem', // Approximately px-3 py-2
                                border: '1px solid #ff7900',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem', // Approximately p-3
                            backgroundColor: '#ff7900',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                        }}
                    >
                        {loading ? 'Please wait ...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;