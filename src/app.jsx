import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className="body">
            <header class="container-fluid">
                <img class="logo" alt="Habit Go logo" src="habit_tracker_logo_transparent.png"/>
                <nav class="navbar navbar-dark">
                    <a class="navbar-brand text-reset" href="#">Habit Go<sup>&reg;</sup></a>
                    <menu class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" href="index.html">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="my_habits.html">My Habits</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="friends.html">Friends</a>
                        </li>
                    </menu>
                </nav>
            </header>

            <main>App components go here</main>

            <footer>
                <div class="container-fluid">
                    <span class="text-reset">Author: Haylee Crow</span>
                    <a class="text-reset" href="https://github.com/hayleecrow/habitstracker">GitHub</a>
                </div>
            </footer>
        </div>
    );
}