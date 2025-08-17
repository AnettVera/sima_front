"use client"

import { useState, useEffect } from "react"
import { categoryService } from "../config/api"
import Swal from "sweetalert2"

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getAll()
      setCategories(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryName) => {
    try {
      const result = await Swal.fire({
        title: "¿Crear categoría?",
        text: "¿Estás seguro de que deseas crear esta categoría?",
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
        await categoryService.create(categoryName)
        await fetchCategories()

        Swal.fire({
          icon: "success",
          title: "¡Categoría creada!",
          text: "La categoría ha sido creada exitosamente",
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

  const updateCategory = async (id, categoryDetails) => {
    try {
      const result = await Swal.fire({
        title: "¿Actualizar categoría?",
        text: "¿Estás seguro de que deseas actualizar esta categoría?",
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
        await categoryService.update(id, categoryDetails)
        await fetchCategories()

        Swal.fire({
          icon: "success",
          title: "¡Categoría actualizada!",
          text: "La categoría ha sido actualizada exitosamente",
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

  const deleteCategory = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar categoría?",
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
        await categoryService.delete(id)
        await fetchCategories()

        Swal.fire({
          icon: "success",
          title: "¡Categoría eliminada!",
          text: "La categoría ha sido eliminada exitosamente",
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
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
