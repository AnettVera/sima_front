"use client"

import { useState, useEffect } from "react"
import { storageService, userService } from "../config/api"
import Swal from "sweetalert2"

export const useStorages = () => {
  const [storages, setStorages] = useState([])
  const [availableManagers, setAvailableManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStorages = async () => {
    try {
      setLoading(true)
      const response = await storageService.getAll()
      setStorages(response.data.data)
      console.log("Storages fetched successfully:", response.data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableManagers = async () => {
    try {
      const response = await userService.getAvailableManagers()
      console.log("respuesta:", response)
      setAvailableManagers(response.data.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchStoragesByResponsible = async (userId) => {
    try {
      const response = await storageService.getByResponsible(userId)
      console.log("respuesta:", response)
      return { data: response.data.data }
    } catch (err) {
      console.error("Error fetching storages by responsible:", err)
      return null
    }
  }

  const createStorage = async (storageData) => {
    try {
      const result = await Swal.fire({
        title: "¿Crear almacén?",
        text: "¿Estás seguro de que deseas crear este almacén?",
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
        await storageService.create(storageData)
        await fetchStorages()

        Swal.fire({
          icon: "success",
          title: "¡Almacén creado!",
          text: "El almacén ha sido creado exitosamente",
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

  const updateStorage = async (id, storageData) => {
    try {
      const result = await Swal.fire({
        title: "¿Actualizar almacén?",
        text: "¿Estás seguro de que deseas actualizar este almacén?",
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
        await storageService.update(id, storageData)
        await fetchStorages()

        Swal.fire({
          icon: "success",
          title: "¡Almacén actualizado!",
          text: "El almacén ha sido actualizado exitosamente",
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

  const deleteStorage = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar almacén?",
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
        await storageService.delete(id)
        await fetchStorages()

        Swal.fire({
          icon: "success",
          title: "¡Almacén eliminado!",
          text: "El almacén ha sido eliminado exitosamente",
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

  const toggleStorageStatus = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Cambiar estado?",
        text: "¿Deseas cambiar el estado de este almacén?",
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
        await storageService.toggleStatus(id)
        await fetchStorages()

        Swal.fire({
          icon: "success",
          title: "¡Estado actualizado!",
          text: "El estado del almacén ha sido actualizado",
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
    fetchStorages()
    fetchAvailableManagers()
  }, [])

  return {

    storages,
    availableManagers,
    loading,
    error,
    fetchStorages,
    fetchAvailableManagers,
    fetchStoragesByResponsible,
    createStorage,
    updateStorage,
    deleteStorage,
    toggleStorageStatus,
  }
}
