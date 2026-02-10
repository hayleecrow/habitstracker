import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className="body">
            <header className="container-fluid">
                <img className="logo" alt="Habit Go logo" src="habit_tracker_logo_transparent.png"/>
                <nav className="navbar navbar-dark">
                    <a className="navbar-brand text-reset" href="#">Habit Go<sup>&reg;</sup></a>
                    <menu className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" href="index.html">Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="my_habits.html">My Habits</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="friends.html">Friends</a>
                        </li>
                    </menu>
                </nav>
            </header>

            <main>App components go here</main>

            <footer>
                <div className="container-fluid">
                    <span className="text-reset">Author: Haylee Crow</span>
                    <a className="text-reset" href="https://github.com/hayleecrow/habitstracker">GitHub</a>
                </div>
            </footer>
        </div>
    );
}