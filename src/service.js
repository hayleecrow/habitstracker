export async function registerUser(userName, password) { 
    const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, "password": password })
    });
    return response;
}

export async function loginUserService(userName, password) {
    const response = await fetch('/api/auth/login', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userName": userName, "password": password })
    });
    return response;
}

export async function logoutUserService() {
    const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export async function getInfoByField(field) {
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

export async function checkUserExists(userName) {
    const response = await fetch('/api/auth/checkUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "userName": userName }),
    });
    const data = await response.json();
    return data.exists;
}

export async function getNotifications() {
    const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data;
}

export async function deleteNotification(notificationId) {
    const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    return response;
}