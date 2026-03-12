import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../service';
import { AuthState } from './authState';

export function Login({ user, authState, onAuthChange }) {
    const [userName, setUserName] = React.useState(user);
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    function loginUser() {
        if (userName !== "") {
            onAuthChange(userName, AuthState.Authenticated);
            navigate('/my_habits');
        }
    }

    function createUser() {
        if (userName !== "") {
            registerUser(userName, password);
            onAuthChange(userName, AuthState.Authenticated);
            navigate('/my_habits');
        }
    }

    function logoutUser() { 
        onAuthChange(userName, AuthState.Unauthenticated);
        location.reload();
    }

    return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        {authState === AuthState.Unauthenticated && (
            <form method="get">
                <div className="input-group mb-3">
                    <input className="form-control" type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <input className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="btn btn-primary" onClick={loginUser}>Login</button>
                <button className="btn" onClick={createUser}>Create Account</button>
            </form>)
        }
        {authState === AuthState.Authenticated && (
            <div>
                <h2>{userName}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/my_habits')}>My Habits</button>
                <button className="btn" onClick={logoutUser}>Logout</button>
            </div>
        )}
    </main>
    );
}