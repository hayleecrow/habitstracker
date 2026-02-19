import React from 'react';

export function Login() {
    const [email, setEmail] = React.useState(localStorage.getItem('email') || '');
    const [password, setPassword] = React.useState(localStorage.getItem('password') || '');

    function loginUser() { 
        console.log(`Logging in user with email: ${email} and password: ${password}`);
        localStorage.setItem('user', email);
        localStorage.setItem('password', password);
    }

    return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        <form method="get" action="my_habits.html">
            <div className="input-group mb-3">
                <input className="form-control" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <input className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary" type="submit" onClick={loginUser}>Login</button>
            <button className="btn" type="submit">Create Account</button>
        </form>
    </main>
    );
}