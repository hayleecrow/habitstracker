import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MyHabits } from './my_habits/my_habits';
import { Friends } from './friends/friends';
import { AuthState } from './login/authState';

export default function App() {
    const [user, setUser] = React.useState('');
    const currentAuthState = user ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    React.useEffect(() => {
        handleRefresh();
    }, []);

    function onAuthChange(userName, newAuthState) {
        setUser(userName);
        setAuthState(newAuthState);
    }

    async function handleRefresh() {
        const res = await fetch('/api/user/me');
        const data = res.ok ? await res.json() : null;
        if (data) {
            setUser(data.userName);
            setAuthState(AuthState.Authenticated);
        } else {
            setUser('');
            setAuthState(AuthState.Unauthenticated);
        }
    }

    return (
        <BrowserRouter>
            <div className="body">
                <header className="container-fluid">
                    <img className="logo" alt="Habit Go logo" src="habit_tracker_logo_transparent.png"/>
                    <nav className="navbar navbar-dark">
                        <NavLink className="navbar-brand text-reset" to="">Habit Go<sup>&reg;</sup></NavLink>
                        <menu className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="">{ authState === AuthState.Unauthenticated ? 'Login' : 'Logout' }</NavLink>
                            </li>
                            <li className="nav-item">
                                {authState === AuthState.Authenticated && <NavLink className="nav-link" to="my_habits">My Habits</NavLink>}
                            </li>
                            <li className="nav-item">
                                {authState === AuthState.Authenticated && <NavLink className="nav-link" to="friends">Friends</NavLink>}
                            </li>
                        </menu>
                    </nav>
                </header>

                <Routes>
                    <Route path='/' element={<Login user={user} authState={authState} onAuthChange={onAuthChange} />} />
                    <Route path='/my_habits' element={<MyHabits userName={user} />} />
                    <Route path='/friends' element={<Friends userName={user} />} />
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