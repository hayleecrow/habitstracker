import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MyHabits } from './my_habits/my_habits';
import { Friends } from './friends/friends';

export default function App() {
    const [user, setUser] = React.useState(localStorage.getItem('user') || null);

    return (
      <BrowserRouter>
        <div className="body">
            <header className="container-fluid">
                <img className="logo" alt="Habit Go logo" src="habit_tracker_logo_transparent.png"/>
                <nav className="navbar navbar-dark">
                    <NavLink className="navbar-brand text-reset" to="">Habit Go<sup>&reg;</sup></NavLink>
                    <menu className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="">Login</NavLink>
                        </li>
                        <li className="nav-item">
                            {user && <NavLink className="nav-link" to="my_habits">My Habits</NavLink>}
                        </li>
                        <li className="nav-item">
                            {user && <NavLink className="nav-link" to="friends">Friends</NavLink>}
                        </li>
                    </menu>
                </nav>
            </header>

            <Routes>
                <Route path='/' element={<Login setUser={setUser} />} exact />
                <Route path='/my_habits' element={<MyHabits user={user} />} />
                <Route path='/friends' element={<Friends user={user} />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                <div className="container-fluid">
                    <span className="text-reset">Author: Haylee Crow</span>
                    <a className="text-reset" href="https://github.com/hayleecrow/habitstracker">GitHub</a>
                </div>
            </footer>
        </div>
      </BrowserRouter>
    );
}

function NotFound() {
  return <main className="container-fluid">404: Return to sender. Address unknown.</main>;
}