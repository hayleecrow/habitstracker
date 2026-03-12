import { AuthState } from './login/authState.js';
import { useNavigate } from 'react-router-dom';

export async function registerUser(userName, password) { 
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, password })
    });
    const data = await response.json();
    return data;
    if (response.ok) {
        useNavigate('/my_habits');
        onAuthChange(userName, AuthState.Authenticated);
    }
}

export async function authUser(userName, password) {
    const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, password })
    });
    const data = await response.json();
    console.log('authUser response:', response);
    return data;
    if (response.ok) {
        useNavigate('/my_habits');
        onAuthChange(userName, AuthState.Authenticated);
    }
}

export async function logoutUserService() {
    const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
    useNavigate('/login');
    onAuthChange(null, AuthState.Unauthenticated);
}