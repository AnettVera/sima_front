"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

const PublicRoute = ({ children }) => {

  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    if (user?.tp === true) {
      return <Navigate to="/changePassword" replace />
    } else if (user?.role === "ADMIN") {
      return <Navigate to="/dashboard" replace />
    } else if (user?.role === "USER") {
      return <Navigate to="/dashboard/user" replace />
    } else {
      return <Navigate to="/unauthorized" replace />
    }
  }


  return children
}

export default PublicRoute
