"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../config/api"
import { userService } from "../config/api"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken)

        if (storedUser) {
          // Opcionalmente puedes confiar en el localStorage
          setUser(JSON.parse(storedUser))
        } else {
          // Si no hay usuario en localStorage, intenta decodificar token
          try {
            const decodedUser = jwtDecode(storedToken)
            setUser({
              id: decodedUser.id,
              username: decodedUser.username,
              email: decodedUser.email,
              role: decodedUser.role,
              tp: decodedUser.temporal_password ? true : false,
            })
          } catch (e) {
            // Token inválido o expirado, limpia sesión
            setToken(null)
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  useEffect(() => {
    const handleForceLogout = () => {
      logout();
      window.location.href = "/login";
    };

    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, []);


  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token)
      if (!exp) return true
      return Date.now() >= exp * 1000
    } catch {
      return true
    }
  }


  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const newToken = response.data.data

      setToken(newToken)

      const decodedUser = jwtDecode(newToken)

      const userData = {
        id: decodedUser.id,
        username: decodedUser.username,
        email: decodedUser.email,
        role: decodedUser.role,
        tp: decodedUser.temporal_password ? true : false,

      }

      setUser(userData)

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error de autenticación",
      }
    }
  }
  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      const res = await userService.changePassword(userId, currentPassword, newPassword)
      return { success: true, message: res.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.data?.message || "Error al cambiar la contraseña",
      }
    }
  }


  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al enviar email",
      }
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    forgotPassword,
    changePassword,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}