import React from 'react';
import { useNavigate } from 'react-router-dom';


export function Login({ setUser }) {
    const [email, setEmail] = React.useState(localStorage.getItem('user') || '');
    const [password, setPassword] = React.useState(localStorage.getItem('password') || '');
    const navigate = useNavigate();

    function loginUser() { 
        localStorage.setItem('user', email);
        localStorage.setItem('password', password);
        setUser(email);
        navigate('/my_habits');
    }

    function createUser() {
        localStorage.setItem('user', email);
        localStorage.setItem('password', password);
        setUser(email);
        navigate('/my_habits');
    }

    function logoutUser() { 
        localStorage.removeItem('user');
        localStorage.removeItem('password');
        setUser(null);
        location.reload();
    }

    return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        {!email && (
            <form method="get">
                <div className="input-group mb-3">
                    <input className="form-control" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <input className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="btn btn-primary" type="submit" onClick={loginUser}>Login</button>
                <button className="btn" type="submit" onClick={createUser}>Create Account</button>
            </form>)
        }
        {email && (
            <div>
                <h2>{email}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/my_habits')}>My Habits</button>
                <button className="btn" onClick={logoutUser}>Logout</button>
            </div>
        )}
    </main>
    );
}