  
  
"use client"

import { useState, useEffect } from "react"
import { articleService, categoryService } from "../config/api"
import Swal from "sweetalert2"

export const useArticles = () => {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await articleService.getAll()
      setArticles(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const assignArticleToStorage = async (storageId, articleId, quantity) => {
    try {
      const result = await Swal.fire({
        title: "¿Agregar artículo al almacén?",
        text: `¿Deseas agregar ${quantity} unidades de este artículo al almacén?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16423C",
        cancelButtonColor: "#6A9C89",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      })

      if (result.isConfirmed) {
        await articleService.assignToStorage(storageId, articleId, quantity)
        await fetchArticles()

        Swal.fire({
          icon: "success",
          title: "¡Artículo agregado!",
          text: "El artículo ha sido agregado exitosamente al almacén",
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

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll()
      setCategories(response.data.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const createArticle = async (articleData) => {
    try {
      const result = await Swal.fire({
        title: "¿Crear artículo?",
        text: "¿Estás seguro de que deseas crear este artículo?",
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
        await articleService.create(articleData)
        await fetchArticles()

        Swal.fire({
          icon: "success",
          title: "¡Artículo creado!",
          text: "El artículo ha sido creado exitosamente",
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

  const updateArticle = async (id, articleData) => {
    try {
      const result = await Swal.fire({
        title: "¿Actualizar artículo?",
        text: "¿Estás seguro de que deseas actualizar este artículo?",
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
        await articleService.update(id, articleData)
        await fetchArticles()

        Swal.fire({
          icon: "success",
          title: "¡Artículo actualizado!",
          text: "El artículo ha sido actualizado exitosamente",
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

  const deleteArticle = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar artículo?",
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
        await articleService.delete(id)
        await fetchArticles()

        Swal.fire({
          icon: "success",
          title: "¡Artículo eliminado!",
          text: "El artículo ha sido eliminado exitosamente",
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

  const updateQuantity = async (id, newQuantity) => {
    try {
      const result = await Swal.fire({
        title: "¿Actualizar cantidad?",
        text: `¿Deseas actualizar la cantidad a ${newQuantity}?`,
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
        await articleService.updateQuantity(id, newQuantity)
        await fetchArticles()

        Swal.fire({
          icon: "success",
          title: "¡Cantidad actualizada!",
          text: "La cantidad ha sido actualizada exitosamente",
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
    fetchArticles()
    fetchCategories()
  }, [])

  return {
    articles,
    categories,
    loading,
    error,
    fetchArticles,
    fetchCategories,
    createArticle,
    updateArticle,
    deleteArticle,
    updateQuantity,
    assignArticleToStorage,
  }
}
