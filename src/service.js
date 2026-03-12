import { AuthState } from './login/authState.js';

export async function registerUser(userName, password) { 
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, password })
    });
    await response.json();
    console.log('registerUser response:', response);
    if (response.ok) {
        navigate('/my_habits');
        onAuthChange(userName, AuthState.Authenticated);
    }
}