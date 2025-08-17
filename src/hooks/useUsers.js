"use client"

import { useState, useEffect } from "react"
import { userService } from "../config/api"
import Swal from "sweetalert2"

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAll()
      setUsers(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    try {
      const result = await Swal.fire({
        title: "¿Crear usuario?",
        text: "¿Estás seguro de que deseas crear este usuario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16423C",
        cancelButtonColor: "#6A9C89",
        confirmButtonText: "Sí, crear",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      })

      if (result.isConfirmed) {
        await userService.create(userData)
        await fetchUsers()

        Swal.fire({
          icon: "success",
          title: "¡Usuario creado!",
          text: "El usuario ha sido creado exitosamente",
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateUser = async (id, userData) => {
    try {
      const result = await Swal.fire({
        title: "¿Actualizar usuario?",
        text: "¿Estás seguro de que deseas actualizar este usuario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16423C",
        cancelButtonColor: "#6A9C89",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      })

      if (result.isConfirmed) {
        await userService.update(id, userData)
        await fetchUsers()

        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado!",
          text: "El usuario ha sido actualizado exitosamente",
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6A9C89",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      })

      if (result.isConfirmed) {
        await userService.delete(id)
        await fetchUsers()

        Swal.fire({
          icon: "success",
          title: "¡Usuario eliminado!",
          text: "El usuario ha sido eliminado exitosamente",
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const toggleUserStatus = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Cambiar estado?",
        text: "¿Deseas cambiar el estado de este usuario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16423C",
        cancelButtonColor: "#6A9C89",
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      })

      if (result.isConfirmed) {
        await userService.toggleStatus(id)
        await fetchUsers()

        Swal.fire({
          icon: "success",
          title: "¡Estado actualizado!",
          text: "El estado del usuario ha sido actualizado",
          confirmButtonColor: "#16423C",
          customClass: {
            popup: "rounded-lg",
            confirmButton: "rounded-lg",
          },
        })
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  }
}
