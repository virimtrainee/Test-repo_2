import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            setMessage('Login successful!');
        } else {
            setMessage('Invalid username or password.');
        }
    };

    return (
        <div className="App">
            <div className="left-section">
                <p>Welcome</p>
            </div>
            <div className="right-section">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;