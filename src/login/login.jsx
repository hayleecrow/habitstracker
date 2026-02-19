import React from 'react';

export function Login({ setUser }) {
    const [email, setEmail] = React.useState(localStorage.getItem('user') || '');
    const [password, setPassword] = React.useState(localStorage.getItem('password') || '');

    function loginUser() { 
        localStorage.setItem('user', email);
        localStorage.setItem('password', password);
        setUser(email);
    }

    function createUser() {
        localStorage.setItem('user', email);
        localStorage.setItem('password', password);
        setUser(email);
    }

    return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        <form method="get">
            <div className="input-group mb-3">
                <input className="form-control" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <input className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary" type="submit" onClick={loginUser}>Login</button>
            <button className="btn" type="submit" onClick={createUser}>Create Account</button>
        </form>
    </main>
    );
}