"use client"

import { useState, useMemo } from "react"
import { useCategories } from "../../hooks/useCategories"
import { TableSkeleton } from "../../components/SkeletonLoader"
import SearchBar from "../../components/SearchBar"
import Modal from "../../components/Modal"
import CategoryForm from "../../components/forms/CategoryForm"

const ITEMS_PER_PAGE = 10

const CategoriesPage = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [filteredCategories, setFilteredCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = (searchTerm) => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      setFilteredCategories([])
      return
    }

    const filtered = categories.filter((category) =>
      category.categoryName?.toLowerCase().includes(term)
    )
    setFilteredCategories(filtered)
    setCurrentPage(1) 
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSubmitCategory = async (values) => {
    let result
    const cleanName = values.name.trim()

    if (!cleanName) return 
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, cleanName)
    } else {
      result = await createCategory(cleanName)
    }

    if (result.success) {
      setIsModalOpen(false)
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id)
  }

  const displayCategories = filteredCategories.length > 0 ? filteredCategories : categories

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return displayCategories.slice(start, end)
  }, [displayCategories, currentPage])

  const totalPages = Math.ceil(displayCategories.length / ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">
            Gestión de Categorías
          </h1>
        </div>
        <TableSkeleton rows={6} columns={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">
          Gestión de Categorías
        </h1>
        <div className="flex justify-end items-center text-black">
          <button onClick={handleCreateCategory} className="btn-outline ml-4">
            Registrar categoría
          </button>
        </div>
      </div>

      <div className="flex-1 justify-between items-center text-black">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Escribe el nombre de la categoría que deseas buscar"
        />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">#</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, indx) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-text">
                    {(currentPage - 1) * ITEMS_PER_PAGE + indx + 1}
                  </td>
                  <td className="py-3 px-4 text-text-primary font-medium">{category.categoryName}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="btn-outline text-sm px-3 py-1"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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

          {displayCategories.length === 0 && (
            <div className="text-center py-8 text-text">No se encontraron categorías</div>
          )}
        </div>

        {/* PAGINACIÓN COMPLETA */}
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
        title={editingCategory ? "Editar Categoría" : "Crear Categoría"}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmitCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default CategoriesPage
