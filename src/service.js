export async function registerUser(userName, password) { 
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, "password": password })
    });
    console.log('registerUser response:', response);
    return response;
}

export async function loginUserService(userName, password) {
    const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, "password": password })
    });
    console.log('loginUserService response:', response);
    return response;
}

export async function logoutUserService() {
    const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('logoutUserService response:', response);
    return response;
}