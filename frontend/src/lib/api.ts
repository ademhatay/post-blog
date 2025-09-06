
export const API_BASE = import.meta.env.VITE_PUBLIC_API_URL;

export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE}/auth/login`,
        REFRESH: `${API_BASE}/auth/refresh`,
        LOGOUT: `${API_BASE}/auth/logout`,
    },
    USERS: {
        SIGNUP: `${API_BASE}/users`,
        LIST: `${API_BASE}/users`,
        GET_ONE: (id: number) => `${API_BASE}/users/${id}`,
        UPDATE: (id: number) => `${API_BASE}/users/${id}`,
        DELETE: (id: number) => `${API_BASE}/users/${id}`,
        SET_ROLE: (id: number) => `${API_BASE}/users/${id}/role`,
        ME: `${API_BASE}/users/me`,
        ME_POSTS: `${API_BASE}/users/me/posts`,
        USER_POSTS: (userId: number) => `${API_BASE}/users/${userId}/posts`,
    },
    POSTS: {
        GET_ALL: `${API_BASE}/posts`,
        GET_ONE: (id: number) => `${API_BASE}/posts/${id}`,
        CREATE_ME: `${API_BASE}/posts`,
        CREATE_FOR_USER: (userId: number) => `${API_BASE}/users/${userId}/posts`,
        UPDATE: (id: number) => `${API_BASE}/posts/${id}`,
        DELETE: (id: number) => `${API_BASE}/posts/${id}`,
    },
} as const;

export type Endpoints = typeof ENDPOINTS;