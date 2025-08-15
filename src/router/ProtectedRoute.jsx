// ProtectedRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import Layout from "../components/Layout"

const ProtectedRoute = ({ children, allowedRoles = [], noLayout = false }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 🔥 Si noLayout es true, no envolver en Layout
  return noLayout ? children : <Layout>{children}</Layout>
}

export default ProtectedRoute
