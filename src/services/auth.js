const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export function getAllUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function signup(email, password) {
    const users = getAllUsers();

    if (users.find(user => user.email === email)) {
        throw new Error('Email already exists');
    }

    const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, never store plain passwords!
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto login after signup
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
}

export function login(email, password) {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

export function isAuthenticated() {
    return !!getCurrentUser();
} 