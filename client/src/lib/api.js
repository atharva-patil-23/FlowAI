import { useAuthStore } from "../store/authStore";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:7070/api";

class ApiError extends Error {
    constructor(message, status, issues) {
        super(message);
        this.status = status;
        this.issues = issues;
    }
}

const NETWORK_ERROR_MESSAGE = "Cannot reach the server. Check your connection and try again.";

export const api = async (path, { method = "GET", body, headers = {}, signal } = {}) => {
    const token = useAuthStore.getState().token;
    let res;
    try {
        res = await fetch(`${BASE}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal,
        });
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
    }

    let payload = null;
    try {
        payload = await res.json();
    } catch {
        payload = null;
    }

    if (!res.ok || payload?.success === false) {
        const message = payload?.error?.message || `Request failed (${res.status})`;
        if (res.status === 401) useAuthStore.getState().clearAuth();
        throw new ApiError(message, res.status, payload?.error?.issues);
    }

    return payload?.data ?? payload;
};

export const apiStream = async (path, { body, signal } = {}) => {
    const token = useAuthStore.getState().token;
    let res;
    try {
        res = await fetch(`${BASE}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
            signal,
        });
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
    }
    if (!res.ok || !res.body) {
        throw new ApiError(`Stream failed (${res.status})`, res.status);
    }
    return res.body;
};

export { ApiError };
