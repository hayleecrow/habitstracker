export async function registerUser(userName, password) { 
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, "password": password })
    });
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
    return response;
}

export async function logoutUserService() {
    const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export async function getAllUserInfo(userName) {
    const response = await fetch(`/api/user/${userName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

export async function getInfoByField(userName, field) {
    const response = await fetch(`/api/${field}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const body = await response.json();
    return body;
}

export async function updateUserInfo(userName, field, value) { 
    const response = await fetch(`/api/${field}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, [field]: value })
    });
    return response;
}