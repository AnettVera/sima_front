"use client"

import { useState, useMemo } from "react"
import { useArticles } from "../../hooks/useArticles"
import { TableSkeleton } from "../../components/SkeletonLoader"
import SearchBar from "../../components/SearchBar"
import Modal from "../../components/Modal"
import ArticleForm from "../../components/forms/ArticleForm"
import Swal from "sweetalert2"

const ITEMS_PER_PAGE = 10

const ArticlesPage = () => {
  const { articles, categories, loading, createArticle, updateArticle, deleteArticle, updateQuantity } = useArticles()
  const [filteredArticles, setFilteredArticles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredArticles([])
      return
    }

    const filtered = articles.filter(
      (article) =>
        article.articleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredArticles(filtered)
    setCurrentPage(1) // Reset page when searching
  }

  const handleCreateArticle = () => {
    setEditingArticle(null)
    setIsModalOpen(true)
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setIsModalOpen(true)
  }

  const handleSubmitArticle = async (articleData) => {
    let result
    if (editingArticle) {
      result = await updateArticle(editingArticle.id, articleData)
    } else {
      result = await createArticle(articleData)
    }

    if (result.success) {
      setIsModalOpen(false)
      setEditingArticle(null)
    }
  }

  const handleDeleteArticle = async (id) => {
    await deleteArticle(id)
  }

  const handleUpdateQuantity = async (id, currentQuantity) => {
    const { value: newQuantity } = await Swal.fire({
      title: "Actualizar Cantidad",
      text: "Ingresa la nueva cantidad:",
      input: "number",
      inputValue: currentQuantity,
      inputAttributes: {
        min: 0,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonColor: "#16423C",
      cancelButtonColor: "#6A9C89",
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
      inputValidator: (value) => {
        if (value === null || value === "" || value < 0) {
          return "Debes ingresar una cantidad válida"
        }
      },
    })

    if (newQuantity !== undefined) {
      await updateQuantity(id, Number.parseInt(newQuantity))
    }
  }

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles

  // PAGINACIÓN
  const totalPages = Math.ceil(displayArticles.length / ITEMS_PER_PAGE)

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return displayArticles.slice(start, start + ITEMS_PER_PAGE)
  }, [displayArticles, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">Gestión de Artículos</h1>
        </div>
        <TableSkeleton rows={6} columns={5} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">Gestión de Artículos</h1>
        <div className="flex justify-end items-center text-black">
          <button onClick={handleCreateArticle} className="btn-outline ml-4">
            Agregar Artículo
          </button>
        </div>
      </div>

      <div className="flex-1 justify-between items-center text-black">
        <SearchBar onSearch={handleSearch} placeholder="Escribe el nombre del artículo que deseas buscar" />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Cantidad</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Categoría</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-text-primary font-medium">{article.articleName}</td>
                  <td className="py-3 px-4 text-text max-w-xs truncate">{article.description}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        article.quantity === 0
                          ? "bg-red-100 text-red-800"
                          : article.quantity < 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {article.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text">
                    {article.category?.categoryName || "Sin categoría"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(article.id, article.quantity)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Cantidad
                      </button>
                      <button onClick={() => handleEditArticle(article)} className="btn-outline text-sm px-3 py-1">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {displayArticles.length === 0 && (
            <div className="text-center py-8 text-text">No se encontraron artículos</div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "Editar Artículo" : "Crear Artículo"}
      >
        <ArticleForm
          article={editingArticle}
          onSubmit={handleSubmitArticle}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
        />
      </Modal>
    </div>
  )
}

export default ArticlesPage
