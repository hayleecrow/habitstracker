import React from 'react';

export function Home() {
  return (
    <main className="container-fluid">
        <h1>Welcome to Habit Go!</h1>
        <form method="get" action="my_habits.html">
            <div className="input-group mb-3">
                <input className="form-control" type="text" placeholder="Email"/>
            </div>
            <div className="input-group mb-3">
                <input className="form-control" type="password" placeholder="Password"/>
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
            <button className="btn" type="submit">Create Account</button>
        </form>
    </main>
  );
}