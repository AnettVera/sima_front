"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"

// Pages
import LoginPage from "../pages/auth/LoginPage"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import DashboardPage from "../pages/DashboardPage"
import DashboardUser from "../pages/DashboardUser"
import UsersPage from "../pages/users/UsersPage"
import CategoriesPage from "../pages/categories/CategoriesPage"
import StoragesPage from "../pages/storages/StoragesPage"
import ArticlesPage from "../pages/articles/ArticlesPage"
import StorageDetailPage from "../pages/storages/StorageDetailPage"
import UnauthorizedPage from "../pages/error/UnauthorizedPage" // crea esta página simple
import LoadingSpinner from "../components/LoadingSpinner"
import ArticlesUser from "../pages/users/ArticlesUser"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"

const AppRouter = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/changePassword"
        element={
          <ProtectedRoute noLayout={true}>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas por rol */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <DashboardUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/storages"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
            <StoragesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/storages/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
            <StorageDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
            <ArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/user/"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <ArticlesUser />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRouter
