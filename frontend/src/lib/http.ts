import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE } from './api'

const ACCESS_TOKEN_KEY = 'accessToken'

export const storage = {
  get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  set accessToken(token: string | null) {
    if (!token) localStorage.removeItem(ACCESS_TOKEN_KEY)
    else localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },
}

export const setAuthToken = (token: string) => {
  storage.accessToken = token
}

export const clearAuthToken = () => {
  storage.accessToken = null
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE,
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.accessToken
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
