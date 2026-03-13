import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUserService, logoutUserService } from '../service';
import { AuthState } from './authState';

export function Login({ user, authState, onAuthChange }) {
    const [userName, setUserName] = React.useState(user);
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    async function loginUser(e) {
        e.preventDefault();
        if (userName !== "") {
            const response = await loginUserService(userName, password);
            if (response.ok) {
                navigate('/my_habits');
                onAuthChange(response.userName, AuthState.Authenticated);
            }
        }
    }

    async function createUser(e) {
        e.preventDefault();
        if (userName !== "") {
            const response = await registerUser(userName, password);
            if (response.ok) {
                navigate('/my_habits');
                onAuthChange(response.userName, AuthState.Authenticated);
            }
        }
    }

    async function logoutUser(e) {
        e.preventDefault();
        await logoutUserService();
        navigate('/');
        onAuthChange(null, AuthState.Unauthenticated);
        // location.reload();
    }

    return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        {authState === AuthState.Unauthenticated && (
            <form>
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