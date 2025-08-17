"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStorages } from "../../hooks/useStorages"
import { useCategories } from "../../hooks/useCategories"
import { TableSkeleton } from "../../components/SkeletonLoader"
import SearchBar from "../../components/SearchBar"
import Modal from "../../components/Modal"
import StorageForm from "../../components/forms/StorageForm"
import { Eye } from "lucide-react"

const StoragesPage = () => {
  const navigate = useNavigate()
  const {
    storages,
    availableManagers,
    loading,
    createStorage,
    updateStorage,
    deleteStorage,
    toggleStorageStatus,
  } = useStorages()

  const { categories } = useCategories()
  const [filteredStorages, setFilteredStorages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStorage, setEditingStorage] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredStorages([])
      return
    }

    const filtered = storages.filter((storage) =>
      storage.identifier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storage.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storage.responsible?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStorages(filtered)
    setCurrentPage(1)
  }

  const handleCreateStorage = () => {
    setEditingStorage(null)
    setIsModalOpen(true)
  }

  const handleEditStorage = (storage) => {
    setEditingStorage(storage)
    setIsModalOpen(true)
  }

  const handleSubmitStorage = async (storageData) => {
    let result
    if (editingStorage) {
      result = await updateStorage(editingStorage.id, storageData)
    } else {
      result = await createStorage(storageData)
    }

    if (result.success) {
      setIsModalOpen(false)
      setEditingStorage(null)
    }
  }

  const handleDeleteStorage = async (id) => {
    await deleteStorage(id)
  }

  const handleViewStorage = (storageId) => {
    navigate(`/storages/${storageId}`)
  }

  const displayStorages = filteredStorages.length > 0 ? filteredStorages : storages

  const paginatedStorages = displayStorages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(displayStorages.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">Gestión de Almacenes</h1>
        </div>
        <TableSkeleton rows={6} columns={5} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">Gestión de Almacenes</h1>
        <button onClick={handleCreateStorage} className="btn-outline ml-4">
          Registrar Almacén
        </button>
      </div>

      <div className="flex-1 justify-between items-center text-black">

      <SearchBar className="flex-1 justify-between items-center text-black"
        onSearch={handleSearch} placeholder="Escribe el nombre del almacén que deseas buscar"
      />
      </div>

      {displayStorages.length === 0 ? (
        <div className="text-center py-8 text-text">No se encontraron almacenes</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStorages.map((storage, index) => (
            <div key={storage.id} className="card p-4 text-black relative">
              {/* 🔄 Switch en la esquina superior derecha */}
              <label className="absolute top-4 right-4 inline-flex items-center cursor-pointer z-10">
                <input
                  type="checkbox"
                  checked={storage.status}
                  onChange={() => toggleStorageStatus(storage.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
                  <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                </div>
              </label>

              <h3 className="text-lg font-semibold text-secondary mb-2">
                {storage.storageIdentifier}
              </h3>
              <p className="text-text mb-1">Categoría: {storage.category?.categoryName || "Sin categoría"}</p>
              <p className="text-text mb-1">
                Responsable:{" "}
                {storage.responsible
                  ? `${storage.responsible.name} ${storage.responsible.lastName}`
                  : "Sin asignar"}
              </p>
              <p className="text-sm mb-2">
                Estado:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${storage.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                  {storage.status ? "Activo" : "Inactivo"}
                </span>
              </p>

              {/* 📍 Botones centrados */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  onClick={() => handleViewStorage(storage.id)}
                  className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleEditStorage(storage)}
                  className="btn-outline text-sm px-3 py-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteStorage(storage.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
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
              className={`px-3 py-1 rounded ${currentPage === i + 1
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStorage ? "Editar Almacén" : "Crear Almacén"}
      >
        <StorageForm
          storage={editingStorage}
          onSubmit={handleSubmitStorage}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
          availableManagers={availableManagers}
        />
      </Modal>
    </div>
  )
}

export default StoragesPage
