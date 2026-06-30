import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })
    const login = async (email, password) => {
        const res = await api.post('/login', { email, password })
        const { user, token } = res.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return user
    }

    const register = async (formData) => {
        const res = await api.post('/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        const { user, token } = res.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return user
    }

    const logout = async () => {
        try { await api.post('/logout') } catch (_) {}
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const isAuthenticated = !!user
    const isAdmin = user?.role === 'admin'
    const isEnseignant = user?.role === 'enseignant'
    const isEtudiant = user?.role === 'etudiant'

    return (
        <AuthContext.Provider value={{
            user, setUser,
            login, register, logout,
            isAuthenticated, isAdmin, isEnseignant, isEtudiant}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)