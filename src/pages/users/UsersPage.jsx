"use client"

import { useState, useMemo } from "react"
import { useUsers } from "../../hooks/useUsers"
import { useStorages } from "../../hooks/useStorages"
import { TableSkeleton } from "../../components/SkeletonLoader"
import SearchBar from "../../components/SearchBar"
import Modal from "../../components/Modal"
import UserForm from "../../components/forms/UserForm"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const ITEMS_PER_PAGE = 5

const UsersPage = () => {
  const { users, loading, createUser, updateUser, deleteUser, toggleUserStatus } = useUsers()
  const { fetchStoragesByResponsible } = useStorages()
  const [userStorage, setUserStorage] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = (searchTerm) => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      setFilteredUsers([])
      return
    }

    const filtered = users
      .filter((user) => user.rol?.name !== "ADMIN")
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      )

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setUserStorage(null)
    setIsModalOpen(true)
  }

  const handleEditUser = async (user) => {
    setEditingUser(user)
    if (user?.id) {
      const storage = await handleGetStorageByResponsable(user.id)
      setUserStorage(storage)
    } else {
      setUserStorage(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmitUser = async (userData) => {
    const cleanedData = {
      ...userData,
      name: userData.name.trim(),
      lastName: userData.lastName.trim(),
      username: userData.username.trim(),
      email: userData.email.trim(),
    }

    let result
    if (editingUser) {
      result = await updateUser(editingUser.id, cleanedData)
    } else {
      result = await createUser(cleanedData)
    }

    if (result.success) {
      setIsModalOpen(false)
      setEditingUser(null)
    }
  }

  const handleGetStorageByResponsable = async (id) => {
    try {
      const result = await fetchStoragesByResponsible(id)
      return result.data
    } catch (error) {
      console.warn("No se encontró almacén para este responsable.")
      return null
    }
  }

  const handleDeleteUser = async (id) => {
    await deleteUser(id)
  }

  const displayUsers = (filteredUsers.length > 0 ? filteredUsers : users).filter(
    (user) => user.rol?.name !== "ADMIN"
  )

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return displayUsers.slice(start, end)
  }, [displayUsers, currentPage])

  const totalPages = Math.ceil(displayUsers.length / ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className=" font-bold text-primary">Gestión de Usuarios</h1>
        </div>
        <TableSkeleton rows={6} columns={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-1">
        <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-primary">Gestión de Usuarios</h1>
        <div className="flex justify-end items-center text-black mx-2">
          <button onClick={handleCreateUser} className="btn-outline ml-4">
            Registrar Usuario
          </button>
        </div>
      </div>

      <div className="flex-1 justify-between items-center text-black">
        <SearchBar onSearch={handleSearch} placeholder="Escribe el nombre del usuario que deseas buscar" />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Estatus</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Registro</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-text-primary font-medium">
                    {user.name} {user.lastName}
                  </td>
                  <td className="py-3 px-4 text-text">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text">
                    {format(new Date(user.createdAt), "dd 'de' MMMM yyyy", { locale: es })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 flex-wrap items-center">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="btn-outline text-sm px-3 py-1"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.active}
                          onChange={() => toggleUserStatus(user.id)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
                          <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                        </div>
                      </label>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {displayUsers.length === 0 && (
            <div className="text-center py-8 text-text">No se encontraron usuarios</div>
          )}
        </div>

        {/* ✅ Paginación idéntica a la de Storages */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Editar Usuario" : "Crear Usuario"}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => setIsModalOpen(false)}
          availableStorages={userStorage}
        />
      </Modal>
    </div>
  )
}

export default UsersPage
